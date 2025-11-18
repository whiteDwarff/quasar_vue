const store = useSystemStore();

/**
 * 응시자 목록 조회
 * @returns object
 */
export function useExamineeList() {
  // 변수
  const param = ref({
    id: '',
    name: '',
    major: '',
    college: '',
    gender: '',
    regDay: [],
    current: 1,
    min: 1,
    max: 1,
  });

  const rows = ref([]);
  const totalCount = ref(0);

  // 응시자 목록 요청
  const getExamineeList = async (page = 1) => {
    try {
      param.value.current = page;

      let regStDt = null;
      let regEnDt = null;
      if (param.value.regDay.length) {
        regStDt = $getStartTimeFormat(param.value.regDay[0]);
        if (param.value.regDay.length == 2 && param.value.regDay[1]) {
          regEnDt = $getEndTimeFormat(param.value.regDay[1]);
        }
      }

      const { offset, limit } = $getPagingOffset(param.value.current);

      const res = await axiosLoading.get('/assign/examinee', {
        params: {
          ...param.value,
          offset,
          limit,
          regStDt,
          regEnDt,
        },
      });

      if (res.data.status == 200) {
        rows.value = res.data.result.list;
        totalCount.value = res.data.result.count;
        param.value.max = $getPagingCount(totalCount.value);
      }
    } catch (err) {
      rows.value = [];
      totalCount.value = 0;
      console.error(err);
    }
  };

  // 검색조건 초기화
  const resetParam = () => {
    param.value.id = '';
    param.value.name = '';
    param.value.major = '';
    param.value.college = '';
    param.value.gender = '';
    param.value.regDay = [];
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
 * @returns {object}    - status, message
 */
export function updateExamineeUseFlag(examineeCode) {
  const res = axiosLoading.patch('/assign/examinee/updateUseFlag', {
    examineeCode,
  });
  return handleApiCall(res);
}
/**
 * 응시자정보 조회
 * @param {number} examineeCode - 응시자pk
 * @returns {object}
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
    return;
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
/**
 * 응시자 정보 조회
 * @param {string} examineeCode
 * @returns object
 */
export async function $fetchedExamineeInfo(examineeCode) {
  store.setLoading(true);

  // 응시자정보 조회
  const { data, error } = await supabase
    .from('tb_examinee_info')
    .select(
      `
      examinee_code, 
      examinee_id, 
      examinee_pass,
      examinee_name,
      examinee_name_en,
      examinee_birth,
      examinee_gender,
      examinee_phone,
      examinee_email,
      examinee_college,
      examinee_major,
      examinee_img,
      use_flag,
      rgst_dt
    `,
    )
    .eq('examinee_code', examineeCode)
    .single();

  // 프로필 이미지가 등록된 경우 bucket의 public url 조회
  if (data && !error) {
    if (data.examinee_img) {
      data.examinee_img_ori = data.examinee_img;
      data.examinee_img = await fetchedProfileImg(data.examinee_img);
    }
    data.rgst_dt = $getTimeFormat(data.rgst_dt);
  }

  store.setLoading(false);

  return {
    data: data ? snakeToCamelByObj(data) : null,
    error: error ? getErrorMessage[error.code] : null,
  };
}
