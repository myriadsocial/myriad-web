import Axios from 'axios';
import { Token } from 'src/interfaces/token';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

type NewAssetProps = {
  userId: string;
  tokenId: string;
};

type NewTokenProps = {
  id: string;
  token_name: string;
  token_decimal: number;
  address_format: number;
  rpc_address: string;
};

export const getTokens = async () => {
  const { data } = await MyriadAPI.request<Token[]>({
    url: '/tokens',
    method: 'GET'
  });

  return data;
};

export const searchToken = async (query: string) => {
  console.log('the values:', query);
  const { data } = await MyriadAPI.request<Token[]>({
    url: `/tokens`,
    method: 'GET',
    params: {
      filter: {
        where: {
          name: {
            like: query
          }
        }
      }
    }
  });

  return data;
};

export const addNewToken = async (values: NewTokenProps) => {
  const { data } = await MyriadAPI.request<Token[]>({
    url: `/tokens`,
    method: 'POST',
    data: values
  });

  return data;
};

export const addUserToken = async (values: NewAssetProps) => {
  const { data } = await MyriadAPI.request<Token[]>({
    url: `/user-tokens`,
    method: 'POST',
    data: values
  });

  return data;
};
