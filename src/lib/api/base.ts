import axios, {AxiosInstance} from 'axios';

type AuthorizationParams = {
  type: string;
  credential: string;
};

let API: AxiosInstance;

/*eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const initialize = (params?: AuthorizationParams): AxiosInstance => {
  if (!API) {
    API = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    API.interceptors.request.use(config => {
      config.headers = {
        // 'Authorization': '<type> <credentials>',
      };

      return config;
    });
  }

  return API;
};

export default initialize();
