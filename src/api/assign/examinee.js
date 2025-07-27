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

  // 등록
  if (!form?.examineeCode) {
    // 응시자정보 등록
    const { data, error } = await supabase
      .from('tb_examinee_info')
      .insert(camelToSnakeByObj(form))
      .select('examinee_code')
      .single();

    status = !error && data?.examinee_code;

    return {
      status,
      error: !status ? '저장 실패하였습니다.' : '',
    };
  }
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
    data.examinee_img = await fetchedProfileImg(data.examinee_img);
    data.rgst_dt = $getTimeFormat(data.rgst_dt);
  }

  store.setLoading(false);

  return {
    data: data ? snakeToCamelByObj(data) : null,
    error: error ? getErrorMessage[error.code] : null,
  };
}

export async function $fetchedExamineeList(param) {
  console.log('fetched');

  let query = supabase
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

  // 응시번호
  if (param.id) query = query.ilike('examinee_id', `${param.id}`);
  // 성별
  if (param.gender) query = query.eq('examinee_gender', param.gender);
  // 이름
  if (param.name) query = query.ilike('examinee_name', `${param.name}`);
  // 대학
  if (param.major) query = query.ilike('examinee_major', `${param.major}`);
  // 학과
  if (param.college) query = query.ilike('examinee_college', `${param.college}`);

  const { data, error } = await query;

  console.log(data, error);
}
