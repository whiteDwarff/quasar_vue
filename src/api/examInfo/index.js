import { supabase } from 'boot/supabase';

/**
 * 시험정보 목록 조회
 */
export async function getExamInfo() {
  const { data, error } = await supabase
    .from('tb_exam_info')
    .select('exam_code, exam_name, rgst_dt, rgst_id');

  return {
    data,
    error,
  };
}
/**
 * 시험정보 등록
 */
export async function addExamInfo(form) {
  // 시험정보
  const { data, error } = await supabase
    .from('tb_exam_info')
    .insert({
      exam_name: form.examName,
    })
    .select('exam_code');

  if (!error) {
    // 시험상세정보
    const examCode = data[0]?.exam_code;
    let { error: formError } = await supabase.from('tb_exam_form_info').insert(
      camelToSnakeByObj(form.list).map((item, i) => {
        item.exam_code = examCode;
        item.exam_order = i + 1;
        return item;
      }),
    );
    return {
      status: !formError ? true : false,
    };
  } else
    return {
      status: false,
    };
}
