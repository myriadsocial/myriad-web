import Axios from 'axios';
import { Wallet } from 'src/interfaces/wallet';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const getWalletAddress = async (postId: string): Promise<Wallet> => {
  const { data } = await MyriadAPI.request<Wallet>({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET'
  });

  return data;
};
