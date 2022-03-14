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
      baseURL: publicRuntimeConfig.appAuthURL + '/api',
    });

    API.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response) {
          console.error('[myriad-api][error]', error.response?.data);
        } else {
          console.error('[error]', error);
        }

        Sentry.captureException(error);

        return Promise.reject(error);
      },
    );
  }

  return API;
};

export const setHeaders = (headers: {cookie: string}): void => {
  if (API) {
    API.interceptors.request.use(config => {
      config.headers = {
        ...config.headers,
        cookie: headers.cookie,
      };

      return config;
    });
  }
};

export default initialize();
