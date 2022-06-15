import * as Sentry from '@sentry/nextjs';

import getConfig from 'next/config';

import axios, {AxiosInstance} from 'axios';

type MyriadAPIParams = {
  cookie?: string;
};

let API: AxiosInstance;

const {publicRuntimeConfig} = getConfig();

const setupAPIClient = () => {
  API = axios.create({
    baseURL: publicRuntimeConfig.appAuthURL + '/api',
  });

  API.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
        console.error(
          JSON.stringify({
            name: '[myriad-api][error]',
            detail: error.response?.data,
          }),
        );
      } else {
        console.error('[error]', error);
      }

      Sentry.captureException(error);

      return Promise.reject(error);
    },
  );
};

export const initialize = (params?: MyriadAPIParams): AxiosInstance => {
  // always create new axios instance when cookie changed
  if (params?.cookie || !API || typeof window === 'undefined') {
    setupAPIClient();
  }

  // add auth header
  if (params?.cookie) {
    API.interceptors.request.use(config => {
      config.headers = {
        ...config.headers,
        cookie: params.cookie,
      };

      return config;
    });
  }

  return API;
};

export default initialize;
