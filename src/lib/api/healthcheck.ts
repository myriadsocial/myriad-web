import getConfig from 'next/config';

import Axios from 'axios';

const {publicRuntimeConfig} = getConfig();

const MyriadAPI = Axios.create({
  baseURL: publicRuntimeConfig.apiURL,
});

export const healthcheck = async (): Promise<boolean> => {
  try {
    await MyriadAPI.request({
      url: `/`,
      method: 'GET',
    });

    return true;
  } catch (error) {
    return false;
  }

  return true;
};
