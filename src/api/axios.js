import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

// const api = axios.create({ baseURL });

const api_loading = axios.create({ baseURL });

// 요청 인터셉터
api_loading.interceptors.request.use(
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
api_loading.interceptors.response.use(
  (response) => {
    useSystemStore().setLoading(false);
    return response;
  },
  (error) => {
    useSystemStore().setLoading(false);
    return Promise.reject(error);
  },
);

export { api_loading };
