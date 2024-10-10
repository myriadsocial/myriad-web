import MyriadAPI from './base';

export const postToken = async (
  hash: string,
  disguise: string,
): Promise<void> => {
  try {
    await MyriadAPI().request({
      url: `/user/personal-access-tokens`,
      method: 'POST',
      data: {
        token: disguise,
        hash: hash,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const getToken = async () => {
  try {
    await MyriadAPI().request({
      url: `/user/personal-access-tokens`,
      method: 'GET',
    });
  } catch (e) {
    console.error(e);
  }
};
