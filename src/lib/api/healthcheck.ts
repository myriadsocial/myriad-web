import getConfig from 'next/config';

import axios from 'axios';

export const healthcheck = async (): Promise<boolean> => {
  const {serverRuntimeConfig} = getConfig();

  const API = axios.create({
    baseURL: serverRuntimeConfig.myriadAPIURL,
  });

  try {
    await API.request({
      url: `/health`,
      method: 'GET',
    });

    return true;
  } catch (error) {
    return false;
  }
};
