import Axios from 'axios';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const healthcheck = async (): Promise<boolean> => {
  try {
    await MyriadAPI.request({
      url: `/`,
      method: 'GET',
    });

    return true;
  } catch (error) {
    console.log('healthcheck', error);
    return false;
  }

  return true;
};
