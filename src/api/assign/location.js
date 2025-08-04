import { supabase, getErrorMessage } from '../supabase';
import { toRaw } from 'vue';

const store = useSystemStore();

/**
 * 장소 등록 및 수정
 * @param {object} form
 * @returns object
 */
export async function $saveLocationInfo(form) {
  try {
    store.setLoading(true);
    let examRoomQuery = supabase.from('tb_examroom_info');

    const {
      examroomName, // 시험장
      examroomLocation, // 시험지역
      examroomAddr, // 시험장소
      examroomInfo, // 시험정보
      examroomCharge, // 담당자
      examroomPhone, // 담당자 전화번호
      examroomChargeInfo, // 담당자
    } = form;

    // 등록
    if (!form?.examroomCode) {
      examRoomQuery = examRoomQuery
        .insert(
          camelToSnakeByObj({
            examroomName,
            examroomLocation,
            examroomAddr,
            examroomInfo,
            examroomCharge,
            examroomPhone,
            examroomChargeInfo,
          }),
        )
        .select('examroom_code')
        .single();
    } else {
      examRoomQuery = examRoomQuery
        .update(
          camelToSnakeByObj({
            examroomName,
            examroomLocation,
            examroomAddr,
            examroomInfo,
            examroomCharge,
            examroomPhone,
            examroomChargeInfo,
            updt_dt: $getNowString(),
          }),
        )
        .eq('examroom_code', form.examroomCode)
        .select('examroom_code')
        .maybeSingle();
    }

    const { data, error } = await examRoomQuery;

    // 성공 - 호실정보 등록
    if (!error && data?.examroom_code) {
      const insertArr = [];
      const updateArr = [];

      // proxy 객체를 순수 객체로 변환 후 깊은 복사 (delete 때문)
      for (let roomNum of structuredClone(toRaw(form.tbExamroomNumInfo))) {
        roomNum.examroomCode = data.examroom_code;
        roomNum.examroomNumMax = roomNum.examroomNumCol * roomNum.examroomNumRow; // 정원
        delete roomNum.key;
        delete roomNum.examroomNumNameOri;
        delete roomNum.examroomNumColOri;
        delete roomNum.examroomNumRowOri;

        roomNum = camelToSnakeByObj(roomNum);

        roomNum?.examroom_num_code ? updateArr.push(roomNum) : insertArr.push(roomNum);
      }

      if (insertArr.length)
        await supabase.from('tb_examroom_num_info').insert(insertArr).select('examroom_num_code');
      if (updateArr.length)
        await supabase
          .from('tb_examroom_num_info')
          .upsert(updateArr, { onConflict: 'examroom_num_code' })
          .select('examroom_num_code');
    }

    return {
      data,
      error: error ? getErrorMessage[error.code] || '저장 실패하였습니다' : '',
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
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
/**
 * 장소 목록조회
 * @param {object} param
 * @returns object
 */
export async function $fetchedLocationList(param) {
  try {
    store.setLoading(true);

    let countQuery = supabase.from('tb_examroom_info').select('*', { count: 'exact', head: true });
    const { count } = await locationListWhere(countQuery, param);

    // 받아올 데이터의 개수 계산
    const { offset, limit } = $getPagingOffset(param.current);

    let dataQuery = supabase
      .from('tb_examroom_info')
      .select(
        `
          examroom_code,
          examroom_name,
          examroom_location,
          examroom_addr
        `,
      )
      .order('examroom_code', { ascending: false });
    const { data, error } = await locationListWhere(dataQuery, param).range(offset, limit);

    return {
      data: snakeToCamelByObj(data),
      error: error ? getErrorMessage[error.code] || '데이터 조회에 실패하였습니다.' : '',
      max: $getPagingCount(count),
      count,
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
/**
 * 장소 조회 검색조건 반환
 * @param {supabase} query
 * @param {object} param
 * @returns
 */
function locationListWhere(query, param) {
  query = query.eq('use_flag', 'Y');

  if (param.examRoomName) query = query.like('examroom_name', `%${param.examRoomName}%`);
  if (param.examRoomLocation)
    query = query.like('examroom_location', `%${param.examRoomLocation}%`);
  return query;
}

/**
 * 장소 사용여부 변경
 * @param {array | number} value
 * @returns object
 */
export async function $updateLocationUsyn(value) {
  store.setLoading(true);

  let query = supabase.from('tb_examroom_info').update({
    use_flag: 'N',
    updt_dt: $getNowString(),
  });

  if (Array.isArray(value)) {
    value = value.map((item) => item.examroomCode);
    query = query.in('examroom_code', value);
  } else query = query.eq('examroom_code', value);

  const { error } = await query.select();

  store.setLoading(false);

  return {
    error: error ? getErrorMessage[error.code] : null,
  };
}
