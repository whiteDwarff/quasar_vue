/**
 * 응시자 목록 조회
 * @returns object
 */
export function useExamineeList() {
  // 변수
  const param = reactive({
    id: '',
    name: '',
    major: '',
    college: '',
    gender: '',
    regDay: [],
    current: 1,
  });

  const rows = ref([]);
  const totalCount = ref(0);

  // 응시자 목록 요청
  const getExamineeList = async (page = 1) => {
    try {
      param.current = page;

      let regStDt = null;
      let regEnDt = null;
      if (param.regDay.length) {
        regStDt = $getStartTimeFormat(param.regDay[0]);
        if (param.regDay.length == 2 && param.regDay[1]) {
          regEnDt = $getEndTimeFormat(param.regDay[1]);
        }
      }

      const { offset, limit } = $getPagingOffset(page);

      const res = await axiosLoading.get('/assign/examinee', {
        params: {
          ...param,
          offset,
          limit,
          regStDt,
          regEnDt,
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
    param.id = '';
    param.name = '';
    param.major = '';
    param.college = '';
    param.gender = '';
    param.regDay = [];
  };

  return {
    param,
    rows,
    totalCount,
    getExamineeList,
    resetParam,
  };
}
/**
 * 응시자정보 사용여부 변경
 * @param {array} value - 응시자pk
 * @returns             - status, message
 */
export function updateExamineeUseFlag(examineeCode) {
  const res = axiosLoading.patch('/assign/examinee/updateUseFlag', {
    examineeCode,
  });
  return handleApiCall(res);
}
/**
 * 응시자정보 조회
 * @returns  응시자 정보
 * @returns  응시자 조회 함수
 */
export function useExamineeInfo() {
  const form = ref({
    examineeCode: null,
    examineeId: '',
    examineePass: '',
    examineeName: '',
    examineeNameEn: '',
    examineeBirth: '',
    examineeGender: '1',
    examineePhone: '',
    examineeEmail: '',
    examineeCollege: '',
    examineeMajor: '',
    examineeImg: '',
  });

  // 응시자 정보 조회
  const getExamineeInfo = async (examineeCode) => {
    // examineeCode 없거나 자료형이 number가 아님
    if (!examineeCode || !$validNumber(examineeCode)) return false;
    try {
      const res = await axiosLoading.get(`/assign/examinee/${examineeCode}`);
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
    getExamineeInfo,
  };
}
/**
 * 응시자 등록 및 수정
 * @param {object} form - 응시자 정보
 * @returns {Promise<Object>}
 */
export function examineeEdit(form, file) {
  const fd = new FormData();
  fd.append('data', JSON.stringify(form));
  // 파일이 있다면 추가
  if (file) fd.append('profile', file);

  const res = axiosLoading.post('/assign/examinee/edit', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return handleApiCall(res);
}
