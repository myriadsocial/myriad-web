import axios, {AxiosInstance} from 'axios';

type AuthorizationParams = {
  type: string;
  credential: string;
};

let API: AxiosInstance;

export const initialize = (params?: AuthorizationParams): AxiosInstance => {
  if (!API) {
    API = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    API.interceptors.request.use(config => {
      console.log('add authorization params', params);
      config.headers = {
        // 'Authorization': '<type> <credentials>',
      };

      return config;
    });
  }

  return API;
};

export default initialize();
