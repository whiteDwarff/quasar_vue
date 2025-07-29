const store = useSystemStore();

/**
 * 응시자정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function $saveExamineeInfo(form, file) {
  store.setLoading(true);

  // 등록일 경우 응시번호 중복검사
  if (!form?.examineeCode) {
    const { count } = await supabase
      .from('tb_examinee_info')
      .select('*', { count: 'exact', head: true })
      .eq('examinee_id', form.examineeId);

    if (count) {
      return {
        status: false,
        error: '등록된 응시번호가 존재합니다.',
      };
    }
  } else {
    // 등록된 이미지가 있을 때
    if (form?.examineeImgOri) {
      // 파일이 변경되지 않은 경우 원본 파일명 재할당
      if (!file && form.examineeImg) form.examineeImg = form.examineeImgOri;
    }
  }

  let status = true; // 반환할 상태 값

  // 파일이 있는 경우 supabase storage에 저장
  if (file) {
    const { path, error: imgError } = await addProfleImgByBucket(file, form.examineeId);

    if (!imgError && path) form.examineeImg = path;
    else {
      return {
        status: false,
        error: '이미지 업로드 실패하였습니다.',
      };
    }
  }

  let query = supabase.from('tb_examinee_info');

  // 수정
  if (form?.examineeCode) {
    delete form.examineeImgOri;
    delete form.rgstDt;

    query = query
      .update(
        camelToSnakeByObj({
          ...form,
          updt_dt: $getNowString(),
        }),
      )
      .eq('examinee_code', form.examineeCode)
      .select('examinee_code')
      .maybeSingle();
    // 등록
  } else {
    query = query.insert(camelToSnakeByObj(form)).select('examinee_code').single();
  }

  const { data, error } = await query;

  status = !error && data?.examinee_code;

  store.setLoading(false);

  return {
    status,
    error: !status ? '저장 실패하였습니다.' : '',
  };
}
/**
 * 응시자 정보 조회
 * @param {string} examineeCode
 * @returns object
 */
export async function $fetchedExamineeInfo(examineeCode) {
  store.setLoading(true);

  // 응시자정보 조회
  const { data, error } = await supabase
    .from('tb_examinee_info')
    .select(
      `
      examinee_code, 
      examinee_id, 
      examinee_pass,
      examinee_name,
      examinee_name_en,
      examinee_birth,
      examinee_gender,
      examinee_phone,
      examinee_email,
      examinee_college,
      examinee_major,
      examinee_img,
      use_flag,
      rgst_dt
    `,
    )
    .eq('examinee_code', examineeCode)
    .single();

  // 프로필 이미지가 등록된 경우 bucket의 public url 조회
  if (data && !error) {
    if (data.examinee_img) {
      data.examinee_img_ori = data.examinee_img;
      data.examinee_img = await fetchedProfileImg(data.examinee_img);
    }
    data.rgst_dt = $getTimeFormat(data.rgst_dt);
  }

  store.setLoading(false);

  return {
    data: data ? snakeToCamelByObj(data) : null,
    error: error ? getErrorMessage[error.code] : null,
  };
}
/**
 * 응시자 목록 조회
 * @param {object} params
 * @returns
 */
export async function $fetchedExamineeList(params) {
  store.setLoading(true);
  // 페이징 개수 조회
  //  count: 'exact' : 정확한 개수 조회
  //  head: true     : 데이터를 같이 조회 하지 않고 개수만 조회
  const countQuery = supabase.from('tb_examinee_info').select('*', { count: 'exact', head: true });

  const { count } = await fetchedListWhere(countQuery, params);

  // 목록 조회용
  const dataQuery = supabase
    .from('tb_examinee_info')
    .select(
      `
      examinee_code,
      examinee_id,
      examinee_gender,
      examinee_name,
      examinee_major,
      examinee_college,
      examinee_phone,
      examinee_img,
      use_flag,
      rgst_dt,
      updt_dt
  `,
    )
    .order('examinee_code', { ascending: false }); // 내림차순 정렬

  // 받아올 데이터의 개수 계산
  const { offset, limit } = $getPagingOffset(params.current);

  const { data, error } = await fetchedListWhere(dataQuery, params).range(offset, limit);

  store.setLoading(false);

  return {
    data: data ? snakeToCamelByObj(data) : null,
    error: error ? getErrorMessage[error.code] : null,
    max: $getPagingCount(count),
    count,
  };
}
/**
 * $fetchedExamineeList의 where 조건 추가
 * @param {supabase} query
 * @param {object} params
 * @returns
 */
function fetchedListWhere(query, params) {
  // 사용여부
  query.eq('use_flag', 'Y');
  // 응시번호
  if (params.id) query = query.ilike('examinee_id', `%${params.id.trim()}%`);
  // 성별
  if (params.gender) query = query.eq('examinee_gender', params.gender);
  // 이름
  if (params.name) query = query.ilike('examinee_name', `%${params.name.trim()}%`);
  // 대학
  if (params.college) query = query.ilike('examinee_college', `%${params.college.trim()}%`);
  // 학과
  if (params.major) query = query.ilike('examinee_major', `%${params.major.trim()}%`);
  // 등록일
  if (params.regDate.length) {
    query = query.gte('rgst_dt', $getTimeFormat(params.regDate[0]));

    if (params.regDate[1])
      query = query.lte('rgst_dt', $getTimeFormat(params.regDate[1]) + ' 23:59:59');
  }

  return query;
}
/**
 * 응시자정보 사용여부 변경
 * @param {array | string} value
 * @returns object
 */
export async function $updateExamineeUsyn(value) {
  store.setLoading(true);

  console.log($getNowString());
  let query = supabase.from('tb_examinee_info').update({
    use_flag: 'N',
    updt_dt: $getNowString(),
  });

  if (Array.isArray(value)) {
    value = value.map((item) => item.examineeCode);
    query = query.in('examinee_code', value);
  } else query = query.eq('examinee_code', value);

  const { error } = await query;

  store.setLoading(false);

  return {
    error: error ? getErrorMessage[error.code] : null,
  };
}
