import * as Sentry from '@sentry/nextjs';

import getConfig from 'next/config';

import axios, {AxiosInstance} from 'axios';

type AuthorizationParams = {
  type: string;
  credential: string;
};

let API: AxiosInstance;

const {publicRuntimeConfig} = getConfig();

export const initialize = (params?: AuthorizationParams): AxiosInstance => {
  if (!API) {
    API = axios.create({
      baseURL: publicRuntimeConfig.apiURL,
    });

    API.interceptors.request.use(config => {
      config.headers = {
        // 'Authorization': '<type> <credentials>',
      };

      return config;
    });

    API.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        Sentry.captureException(error);

        return Promise.reject(error);
      },
    );
  }

  return API;
};

export default initialize();
