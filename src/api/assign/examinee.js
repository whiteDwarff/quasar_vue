const store = useSystemStore();

/**
 * 응시자정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function $saveExamineeInfo(form, file) {
  store.setLoading(true);

  let status = true; // 반환할 상태 값
  let fileName = ''; // 파일명

  if (file) {
    const ext = file.name.split('.').pop().toLowerCase();
    fileName = `${crypto.randomUUID()}-${form.examineeId}.${ext}`;
    // 스토리지에 이미지 저장
    const { data: examineeImg, error: imgError } = await supabase.storage
      .from('images')
      .upload(`profile/${fileName}`, file);

    if (!imgError && examineeImg.path) form.examineeImg = examineeImg.path;
    else return $showAlert('이미지 저장에 실패하였습니다.');
    console.log(examineeImg, imgError);
  }

  // 등록
  if (!form?.examineeCode) {
    if (file) form.examineeImg = '';

    // 응시자정보 등록
    const { data, error } = await supabase
      .from('tb_examinee_info')
      .insert(camelToSnakeByObj(form))
      .select('examinee_code')
      .single();

    status = !error && data?.examinee_code;

    store.setLoading(false);
    return { status };
  }
}
