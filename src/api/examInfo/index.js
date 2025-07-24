import { supabase } from 'boot/supabase';

/**
 * 시험목록 조회
 * @param {object} params
 * @returns object
 */
export async function $fetchedExamList(params) {
  // 페이지네이션 사용 위한 개수 조회
  const { count } = await supabase
    .from('tb_exam_info')
    .select('*', { count: 'exact', head: true })
    .eq('use_flag', 'Y')
    .ilike('exam_name', `%${params.examName}%`);

  const { offset, limit } = $getPagingOffset(params.current);

  const { data, error } = await supabase
    .from('tb_exam_info')
    .select('exam_code, exam_name, rgst_dt, rgst_id')
    .eq('use_flag', 'Y') // where
    .ilike('exam_name', `%${params.examName}%`)
    .range(offset, limit)
    .order('exam_code', { ascending: false }); // 내림차순 정렬

  return {
    data: snakeToCamelByObj(data),
    max: $getPagingCount(count),
    count,
    error,
  };
}
/**
 * 시험정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function $saveExamInfo(form) {
  const obj = { exam_name: form.examName };
  if (form?.examCode) obj.exam_code = form.examCode;

  // 시험정보 등록
  const { data, error } = await supabase
    .from('tb_exam_info')
    .upsert(obj, { onConflict: 'exam_code' })
    .select('exam_code')
    .maybeSingle(); // 0 또는 1개의 row 조회

  if (!error && data?.exam_code) {
    // 시험상세정보 등록
    const examCode = data?.exam_code; // 상위 테이블 seq

    let { error: formError } = await supabase.from('tb_exam_form_info').upsert(
      camelToSnakeByObj(form.tbExamFormInfo).map((item, i) => {
        item.exam_code = examCode;
        item.exam_order = i + 1;
        return item;
      }),
      { onConflict: 'exam_form_code' },
    );
    return { status: !formError ? true : false };
  } else return { status: false };
}

export async function $fetchedExamInfo(examCode) {
  const { data, error } = await supabase
    .from('tb_exam_info')
    .select(
      `
      exam_code, exam_name, 
      tb_exam_form_info(
        exam_form_code,
        exam_code,
        exam_form_name,
        exam_order,
        exam_method,
        exam_total_time,
        personal_info_message,
        personal_info_use_flag,
        use_flag
      )
    `,
    )
    .eq('exam_code', examCode)
    .single();

  return {
    data: snakeToCamelByObj(data),
    error,
  };
}
