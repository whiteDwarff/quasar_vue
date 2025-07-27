const store = useSystemStore();

/**
 * 응시자정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function $saveExamineeInfo(form, file) {
  store.setLoading(true);

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

    // 응시자정보 등록
    const { data, error } = await supabase
      .from('tb_examinee_info')
      .insert(camelToSnakeByObj(form))
      .select('examinee_code')
      .single();

    status = !error && data?.examinee_code;

    return {
      status,
      error: '저장 실패하였습니다.',
    };
  }
}
