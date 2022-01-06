import MyriadAPI from 'src/lib/api/base';

export const healthcheck = async (): Promise<boolean> => {
  try {
    await MyriadAPI.request({
      url: `/health`,
      method: 'GET',
    });

    return true;
  } catch (error) {
    return false;
  }
};
