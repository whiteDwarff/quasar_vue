export function useServeyList() {
  const param = reactive({
    researchTitle: '',
    researchMemo: '',
    current: 1,
  });

  const rows = ref([]);
  const totalCount = ref(0);

  // 설문 목록 요청
  const getServeyList = async (page = 1) => {
    try {
      param.current = page;

      const res = await axiosLoading.get('/assign/servey', {
        params: {
          ...param,
          ...$getPagingOffset(page),
        },
      });

      if (res.data.status == 200) {
        rows.value = res.data.result.list;
        totalCount.value = res.data.result.count;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetParam = () => {
    param.researchTitle = '';
    param.researchMemo = '';
    param.current = 1;
  };

  return {
    param,
    rows,
    totalCount,
    getServeyList,
    resetParam,
  };
}
/**
 * 설문 사용여부 변경
 * @param {array} value
 * @returns object
 */
export function updateServeyUseFlag(researchCode) {
  const res = axiosLoading.patch('/assign/servey/updateUseFlag', {
    researchCode,
  });
  return handleApiCall(res);
}
/**
 * 설문 등록 및 수정
 * @param {object} form
 * @returns object
 */
export function serveyEdit(form) {
  const res = axiosLoading.post('/assign/servey/edit', form);
  return handleApiCall(res);
}
/**
 * 설문정보 조회
 * @returns  설문 정보
 * @returns  설문 조회 함수
 */
export function useServeyInfo() {
  const form = ref({
    researchCode: null,
    researchTitle: '',
    researchMemo: '',
    survey: [
      {
        reItemCode: null,
        reItemTitle: '',
        reItemNo: 1,
        reItemType: '1',
        useFlag: 'Y',
        reItemExample: [
          {
            value: '',
            order: 1,
          },
          {
            value: '',
            order: 2,
          },
        ],
      },
    ],
    currentOrder: 1,
  });

  // 응시자 정보 조회
  const getServeyInfo = async (researchCode) => {
    // researchCode 없거나 자료형이 number가 아님
    if (!researchCode || !$validNumber(researchCode)) return false;
    try {
      const res = await axiosLoading.get(`/assign/servey/${researchCode}`);
      if (res.data.status == 200) {
        const { result } = res.data;
        // 문항 > 보기 map으로 변경
        for (let item of result.survey) {
          item.reItemExample = item.reItemExample.map((value, i) => {
            return {
              order: i + 1,
              value,
            };
          });
        }

        form.value = result;
        form.value.currentOrder = 1;
        return true;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { form, getServeyInfo };
}
