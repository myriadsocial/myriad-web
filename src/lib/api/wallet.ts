import Axios from 'axios';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const getWalletAddress = async (postId: string) => {
  const { data } = await MyriadAPI({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET'
  });

  return data;
};

export const sendTips = async (postId: string, amountSent: string) => {
  const { data } = await MyriadAPI({
    url: `/posts/${postId}/update-tips`,
    method: 'POST',
    data: amountSent
  });

  return data;
};
