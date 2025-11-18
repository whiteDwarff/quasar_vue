import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

// const api = axios.create({ baseURL });

const axiosLoading = axios.create({ baseURL });

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
    return Promise.reject(error);
  },
);

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
      message: res.data.message || '요청에 성공했습니다.',
    };
    // API 요청 실패
  } catch (err) {
    const { response } = err;
    console.log(response);
    const message = response?.data?.message || '알 수 없는 오류가 발생했습니다.';

    return {
      status: false,
      message,
    };
  }
}

export { axiosLoading, handleApiCall };
