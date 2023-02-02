import * as Sentry from '@sentry/nextjs';

import getConfig from 'next/config';

import axios, {AxiosInstance} from 'axios';

type MyriadAPIParams = {
  apiURL?: string;
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

const setupFederatedAPIClient = (apiURL: string) => {
  API = axios.create({
    baseURL: apiURL,
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

export const initialize = (params?: MyriadAPIParams, anonymous?: boolean): AxiosInstance => {
  if (params?.apiURL) {
    setupFederatedAPIClient(params?.apiURL);
  }

  // always create new axios instance when cookie changed
  if (params?.cookie || !API || anonymous) {
    setupAPIClient();
  }

  console.log('initApi', params?.cookie);

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
