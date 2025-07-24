import { supabase } from 'boot/supabase';

/**
 * 시험목록 조회
 * @param {object} params
 * @returns object
 */
export async function getExamList(params) {
  console.log(params);

  const { data, error, count } = await supabase
    .from('tb_exam_info')
    .select('exam_code, exam_name, rgst_dt, rgst_id', {
      count: 'exact', // 목록 개수 조회
      head: false, // 데이터 포함
    })
    .eq('use_flag', 'Y') // where
    .ilike('exam_name', `%${params.examName}%`)
    .order('exam_code', { ascending: false }); // 내림차순 정렬

  return {
    data: snakeToCamelByObj(data),
    count,
    error,
  };
}
/**
 * 시험정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function addExamInfo(form) {
  // 시험정보 등록
  const { data, error } = await supabase
    .from('tb_exam_info')
    .upsert({ exam_name: form.examName }, { onConflict: 'exam_code' })
    .select('exam_code')
    .maybeSingle(); // 0 또는 1개의 row 조회

  if (!error && data?.exam_code) {
    // 시험상세정보 등록
    const examCode = data?.exam_code; // 상위 테이블 seq

    let { error: formError } = await supabase.from('tb_exam_form_info').upsert(
      camelToSnakeByObj(form.list).map((item, i) => {
        item.exam_code = examCode;
        item.exam_order = i + 1;
        return item;
      }),
      { onConflict: 'exam_form_code' },
    );
    return { status: !formError ? true : false };
  } else return { status: false };
}
