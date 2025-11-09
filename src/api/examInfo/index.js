import { supabase, getErrorMessage } from '../supabase';

const store = useSystemStore();

/**
 * 시험목록 조회
 * @param {object} params
 * @returns object
 */
export function useExamList() {
  // 변수
  const param = ref({
    examName: '',
    regId: '',
    regDay: [],
    regStDt: null,
    regEnDt: null,
    current: 1,
    min: 1,
    max: 1,
  });
  const rows = ref([]);
  const totalCount = ref(0);

  // 시험정보 요청
  const getExamList = async (page = 1) => {
    param.value.current = page;
    if (param.value.regDay.length) {
      param.value.regStDt = param.value.regDay[0];
      if (param.value.regDay.length == 2 && param.value.regDay[0]) {
        param.value.regEnDt = param.value.regDay[1];
      }
    }

    const { offset, limit } = $getPagingOffset(param.value.current);

    const res = await api_loading.get('/examInfo', {
      params: {
        ...param.value,
        offset,
        limit,
      },
    });

    if (res.data.status == 200) {
      rows.value = res.data.result.list;
      totalCount.value = res.data.result.count;
      param.value.max = $getPagingCount(totalCount.value);
    }
  };

  const resetParam = () => {
    param.value.examName = '';
    param.value.regId = '';
    param.value.regDay = [];
    param.value.regStDt = null;
    param.value.regEnDt = null;
  };

  return {
    param,
    rows,
    totalCount,
    getExamList,
    resetParam,
  };
}
/**
 * 시험정보 등록
 * @param {object} form
 * @returns boolean
 */
export async function $saveExamInfo(form) {
  store.setLoading(true);

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

    const insertArr = [];
    const updateArr = [];
    const status = {
      insert: true,
      update: true,
    };

    for (let [i, item] of [...form.tbExamFormInfo].entries()) {
      item.exam_order = i + 1;
      item = camelToSnakeByObj(item);
      if (item?.exam_code) updateArr.push(item);
      else {
        item.exam_code = examCode;
        insertArr.push(item);
      }
    }

    if (insertArr.length) {
      let { error: insertErr } = await supabase.from('tb_exam_form_info').insert(insertArr);
      status.insert = !insertErr;
    }

    if (updateArr.length) {
      let { error: updateErr } = await supabase
        .from('tb_exam_form_info')
        .upsert(updateArr, { onConflict: 'exam_form_code' });
      status.insert = !updateErr;
    }

    store.setLoading(false);

    return {
      status: status.insert && status.update,
    };
  } else return { status: false };
}
/**
 * 시험정보 상세조회
 * @param {number} examCode
 * @returns object
 */
export async function $fetchedExamInfo(examCode) {
  store.setLoading(true);

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
    .eq('tb_exam_form_info.use_flag', 'Y')
    .order('exam_order', { referencedTable: 'tb_exam_form_info', ascending: true })
    .single();

  store.setLoading(false);

  return {
    data: snakeToCamelByObj(data),
    error: error ? getErrorMessage[error.code] || '조회 실패하였습니다.' : '',
  };
}
/**
 * 시험정보 사용유무 변경
 * @param {number} examCode
 * @returns object
 */
export async function $updateExamInfoUsyn(examCode) {
  try {
    store.setLoading(true);

    const { data, error } = await supabase
      .from('tb_exam_info')
      .update({ use_flag: 'N' })
      .eq('exam_code', examCode)
      .select();

    return {
      data: data.length ? snakeToCamelByObj(data[0]) : null,
      error: error ? getErrorMessage[error.code] || '저장 실패하였습니다.' : null,
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}

export async function $fechtedExamNodes() {
  try {
    store.setLoading(true);

    const { data, error } = await supabase
      .from('tb_exam_info')
      .select(
        `
      exam_code, exam_name, 
      tb_exam_form_info(
        exam_form_code,
        exam_code,
        exam_form_name
      )
    `,
      )
      .eq('use_flag', 'Y')
      .eq('tb_exam_form_info.use_flag', 'Y')
      .order('exam_code', { ascending: false })
      .order('exam_order', { referencedTable: 'tb_exam_form_info', ascending: true });

    const nodes = [];
    if (!error) {
      for (let node of snakeToCamelByObj(data)) {
        const obj = {
          hedaer: 'top',
          key: node.examCode,
          label: node.examName,
          children: node.tbExamFormInfo.map((child) => {
            return {
              hedaer: 'middle',
              key: child.examFormCode,
              label: child.examFormName,
              fullLabel: `${node.examName}(${child.examFormName})`,
              upprKey: node.examCode,
            };
          }),
        };
        nodes.push(obj);
      }
    }

    return {
      data: nodes,
      error: error ? getErrorMessage[error.code] || '조회 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
