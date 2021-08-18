import getConfig from 'next/config';

import Axios from 'axios';

const {publicRuntimeConfig} = getConfig();

const MyriadAPI = Axios.create({
  baseURL: publicRuntimeConfig.apiURL,
});

export const getWalletAddress = async (postId: string) => {
  const {data} = await MyriadAPI({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};
