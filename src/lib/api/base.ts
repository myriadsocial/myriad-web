import * as Sentry from '@sentry/nextjs';

import getConfig from 'next/config';

import axios, {AxiosInstance} from 'axios';

type MyriadAPIParams = {
  cookie?: string;
};

let API: AxiosInstance;

const {publicRuntimeConfig} = getConfig();

export const initialize = (params?: MyriadAPIParams): AxiosInstance => {
  // always create new axios instance when cookie changed
  if (params?.cookie || !API) {
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
