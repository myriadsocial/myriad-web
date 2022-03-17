import MyriadAPI from './base';

type UserNonceProps = {
  nonce: number;
};

export const getWalletAddress = async (postId: string) => {
  const {data} = await MyriadAPI({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};

export const getUserNonce = async (id: string): Promise<UserNonceProps> => {
  const {data} = await MyriadAPI.request({
    url: `wallets/${id}/nonce`,
    method: 'GET',
  });

  return data ? data : {nonce: 0};
};
