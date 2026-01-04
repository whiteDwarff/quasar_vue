const store = useSystemStore();

/**
 * 관리자정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function $saveUserInfo(form, file) {
  console.log(file);
  store.setLoading(true);

  // 등록일 경우 응시번호 중복검사
  if (!form?.userCode) {
    const { count } = await supabase
      .from('tb_user_info')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', form.userId);

    if (count) {
      return {
        status: false,
        error: '등록된 관리자가 존재합니다.',
      };
    }
  }

  let status = true; // 반환할 상태 값

  // 파일이 있는 경우 supabase storage에 저장
  // if (file) {
  //   const { path, error: imgError } = await addProfleImgByBucket(file, form.userId);

  //   if (!imgError && path) form.userImg = path;
  //   else {
  //     return {
  //       status: false,
  //       error: '이미지 업로드 실패하였습니다.',
  //     };
  //   }
  // }

  // 등록
  if (!form?.userCode) {
    // 응시자정보 등록
    const { data, error } = await supabase
      .from('tb_user_info')
      .insert(camelToSnakeByObj(form))
      .select('user_code')
      .single();

    status = !error && data?.user_code;

    return {
      status,
      error: !status ? '저장 실패하였습니다.' : '',
    };
  }
}
