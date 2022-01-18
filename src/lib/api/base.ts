import * as Sentry from '@sentry/nextjs';

import {getSession} from 'next-auth/client';
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
      baseURL: publicRuntimeConfig.nextAuthURL + '/api',
    });

    API.interceptors.request.use(async config => {
      try {
        const session = await getSession();

        //@ts-ignore
        if (session && session?.user) {
          config.headers = {
            //@ts-ignore
            Authorization: `Bearer ${session.user.token}`,
          };
        }
      } catch (error) {
        Sentry.captureException(error);
      }
      return config;
    });

    API.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        console.error('[myriad-api][error]', error.message);

        Sentry.captureException(error);

        return Promise.reject(error);
      },
    );
  }

  return API;
};

export default initialize();
