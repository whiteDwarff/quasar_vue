const store = useSystemStore();

/**
 * 응시자정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function $saveExamineeInfo(form, file) {
  store.setLoading(true);
  // 반환할 상태 값
  let status = true;

  // 등록
  if (!form?.examineeCode) {
    if (file) form.examineeImg = '';

    // 응시자정보 등록
    const { data, error } = await supabase
      .from('tb_examinee_info')
      .insert(camelToSnakeByObj(form))
      .select('examinee_code')
      .single(); // 0 또는 1개의 row 조회

    status = !error && data?.examinee_code;

    store.setLoading(false);
    return { status };
  }
}
