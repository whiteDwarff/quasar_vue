import { $validNumber } from 'src/utils/validate-rules';
import { supabase, getErrorMessage } from '../supabase';
import { axiosLoading } from '../axios';

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
      param.value.regStDt = $getStartTimeFormat(param.value.regDay[0]);
      if (param.value.regDay.length == 2 && param.value.regDay[0]) {
        param.value.regEnDt = $getEndTimeFormat(param.value.regDay[1]);
      }
    }

    const { offset, limit } = $getPagingOffset(param.value.current);

    const res = await axiosLoading.get('/examInfo', {
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
 * 시험정보 사용유무 변경
 * @param {number} examCode - 시험정보pk
 * @returns boolean - 성공여부
 */
export async function updateExamInfoUseFlag(examCode) {
  try {
    const res = await await axiosLoading.patch(`/examInfo/updateUseFlag/${examCode}`);
    return res.data.status == 200;
  } catch (error) {
    console.log(error);
    return false;
  }
}
/**
 * 시험정보 객체 반환 및 상세 조회
 * @param {number} examCode - 시험정보pk
 * @returns object
 */
export function useExamInfo() {
  const form = ref({
    // companySeq: '',
    examCode: null,
    examName: '',
    details: [
      {
        formName: '',
        method: 'UBT',
        totalTime: '',
        personalInfoUseFlag: 'N',
        personalInfoMessage: '',
        useFlag: 'Y',
      },
    ],
  });

  // 등록된 시험정보 조회
  const getExamInfo = async (examCode) => {
    // examCode가 없거나 자료형이 number가 아님
    if (!examCode || $validNumber(examCode)) return false;

    try {
      const res = await axiosLoading.get(`/examInfo/${examCode}`);
      if (res.data.status == 200) {
        form.value = res.data.result;
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return {
    form,
    getExamInfo,
  };
}
/**
 * 시험정보 등록 및 수정
 * @param {object} form
 * @returns boolean
 */
export async function editExamInfo(form) {
  try {
    const res = await axiosLoading.post('/examInfo/edit', form);
    return res.data.status == 'Y';
  } catch (err) {
    console.log(err);
    return false;
  }
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
