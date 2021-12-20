import MyriadAPI from './base';

export const getWalletAddress = async (postId: string) => {
  const {data} = await MyriadAPI({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};
