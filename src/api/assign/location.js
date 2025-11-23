import { supabase, getErrorMessage } from '../supabase';

const store = useSystemStore();

/**
 * 장소 목록조회
 * @param {object} param
 * @returns object
 */
export function useLocationList() {
  const param = reactive({
    roomName: '',
    location: '',
    current: 1,
  });

  const rows = ref([]);
  const totalCount = ref(0);

  // 시험장 목록 요청
  const getLocationList = async (page = 1) => {
    try {
      param.current = page;

      const res = await axiosLoading.get('/assign/location', {
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

  // 검색조건 초기화
  const resetParam = () => {
    param.roomName = '';
    param.location = '';
  };

  return {
    param,
    rows,
    totalCount,
    getLocationList,
    resetParam,
  };
}
/**
 * 시험장 사용여부 변경
 * @param {array} value
 * @returns object
 */
export function updateLocationUseFlag(examroomCode) {
  const res = axiosLoading.patch('/assign/location/updateUseFlag', {
    examroomCode,
  });
  return handleApiCall(res);
}

export function useLocationInfo() {
  const form = ref({
    examroomCode: null,
    examroomName: '', // 시험장
    examroomLocation: '', // 시험지역
    examroomAddr: '', // 시험장소
    examroomInfo: '', // 시험정보
    examroomCharge: '', // 담당자
    examroomPhone: '', // 담당자 전화번호
    examroomChargeInfo: '', // 담당자 정보
    roomNumInfo: [],
  });

  // 시험장 정보 조회
  const getLocation = async (examroomCode) => {
    // examroomCode가 없거나 자료형이 number가 아님
    if (!examroomCode || !$validNumber(examroomCode)) return false;
    try {
      const res = await axiosLoading.get(`/assign/location/${examroomCode}`);
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
    getLocation,
  };
}
/**
 * 장소 등록 및 수정
 * @param {object} form
 * @returns object
 */
export function locationEdit(form) {
  const res = axiosLoading.post('/assign/location/edit', form);
  return handleApiCall(res);
}
/**
 * 장소 상세 조회
 * @param {number} examRoomCode
 * @returns object
 */
export async function $fetchedLocationInfo(examRoomCode) {
  try {
    store.setLoading(true);
    let { data, error } = await supabase
      .from('tb_examroom_info')
      .select(
        `
      examroom_code,
      examroom_name,
      examroom_location,
      examroom_addr,
      examroom_info,
      examroom_charge,
      examroom_phone,
      examroom_charge_info,
      tb_examroom_num_info ( 
        examroom_code,
        examroom_num_code,
        examroom_num_name,
        examroom_num_max,
        examroom_num_row,
        examroom_num_col,
        examroom_num_info,
        use_flag
        )
        `,
      )
      .eq('examroom_code', examRoomCode)
      .eq('use_flag', 'Y')
      .eq('tb_examroom_num_info.use_flag', 'Y')
      .order('examroom_num_code', { referencedTable: 'tb_examroom_num_info', ascending: true })
      .single();

    if (!error) {
      data = snakeToCamelByObj(data);

      for (let item of data.tbExamroomNumInfo) {
        item.examroomNumNameOri = item.examroomNumName;
        item.examroomNumColOri = item.examroomNumCol;
        item.examroomNumRowOri = item.examroomNumRow;
        item.key = item.examroomNumCode;
      }
    }

    return {
      data,
      error: error ? getErrorMessage[error.code] || '조회 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
