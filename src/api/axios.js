import axios from 'axios';
import { $showAlert } from 'src/utils/globals';

const baseURL = '/api';

const axiosLoading = axios.create({ baseURL });
const api = axios.create({ baseURL });

// 요청 인터셉터
axiosLoading.interceptors.request.use(
  (config) => {
    useSystemStore().setLoading(true);
    return config;
  },
  (error) => {
    useSystemStore().setLoading(false);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosLoading.interceptors.response.use(
  (response) => {
    useSystemStore().setLoading(false);
    return response;
  },
  (error) => {
    useSystemStore().setLoading(false);
    responseErrorHandler(error);
    return Promise.reject(error);
  },
);

/**
 * response의 에러 처리 공통 메서드
 * @param {object} error
 */
function responseErrorHandler(error) {
  let errorMessage = '요청 처리 중 알 수 없는 오류가 발생했습니다.';

  if (error.response && error.response?.data) {
    errorMessage = error.response.data.message;
    // 에러 원인
    const context = error.response?.data?.result?.context || '';
    // 개발 모드에서는 오류원인 출력
    if (process.env.NODE_ENV === 'development' && context) errorMessage += `<br/>[${context}]`;
  } else if (error.request) {
    errorMessage = '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
  }

  // 에러 메시지 활성화
  $showAlert(errorMessage);
}

/**
 * API 요청과 표준 응답/오류 처리를 감싸는 래퍼 함수
 * @param {Promise} apiCall 비동기 response 객체
 */
async function handleApiCall(apiCall) {
  // API 요청 성공
  try {
    const res = await apiCall;
    return {
      status: res.data.status === 200,
      message: res.data.message || '요청 성공했습니다.',
      data: res.data?.result || {},
    };
    // API 요청 실패
  } catch (err) {
    const { response } = err;

    return {
      status: false,
      message: response?.data?.message || '요청 처리 중 오류가 발생하였습니다.',
      data: null,
    };
  }
}

export { api as axios, axiosLoading, handleApiCall };
