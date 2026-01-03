/**
 * 시험목록 조회
 * @returns object
 */
export function useExamList() {
  // 변수
  const param = reactive({
    examName: '',
    rgstId: '',
    regDay: [],
    regStDt: null,
    regEnDt: null,
    current: 1,
  });
  const rows = ref([]);
  const totalCount = ref(0);

  // 시험정보 요청
  const getExamList = async (page = 1) => {
    try {
      param.current = page;
      if (param.regDay.length) {
        param.regStDt = $getStartTimeFormat(param.regDay[0]);
        if (param.regDay.length == 2 && param.regDay[1]) {
          param.regEnDt = $getEndTimeFormat(param.regDay[1]);
        }
      }

      const { offset, limit } = $getPagingOffset(page);

      const res = await axiosLoading.get('/examInfo', {
        params: {
          ...param,
          offset,
          limit,
        },
      });

      if (res.data.status == 200) {
        rows.value = res.data.result.list;
        totalCount.value = res.data.result.count;
      }
    } catch (err) {
      rows.value = [];
      totalCount.value = 0;
      console.error(err);
    }
  };

  // 검색조건 초기화
  const resetParam = () => {
    param.examName = '';
    param.rgstId = '';
    param.regDay = [];
    param.regStDt = null;
    param.regEnDt = null;
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
export function updateExamInfoUseFlag(examCode) {
  const res = axiosLoading.patch(`/examInfo/updateUseFlag/${examCode}`);
  return handleApiCall(res);
}
/**
 * 시험정보 객체 반환 및 상세 조회
 * @param {number} examCode - 시험정보pk
 * @returns object
 */
export function useExamInfo() {
  const form = ref({
    examCode: null,
    examName: '',
    details: [
      {
        examFormCode: null,
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
    if (!examCode || !$validNumber(examCode)) return false;
    try {
      const res = await axiosLoading.get(`/examInfo/${examCode}`);
      if (res.data.status == 200) {
        form.value = res.data.result;
        return true;
      }
    } catch (err) {
      console.error(err);
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
    return res.data.status == 200;
  } catch (err) {
    console.error(err);
    return false;
  }
}
