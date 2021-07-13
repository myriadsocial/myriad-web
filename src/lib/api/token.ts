import Axios from 'axios';
import { Token } from 'src/interfaces/token';
import { User } from 'src/interfaces/user';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
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

export const getTokens = async (): Promise<Token[]> => {
  const { data } = await MyriadAPI.request<Token[]>({
    url: '/tokens',
    method: 'GET'
  });

  return data;
};

export const searchToken = async (query: string): Promise<Token[]> => {
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

export const addNewToken = async (values: NewTokenProps): Promise<Token[]> => {
  const { data } = await MyriadAPI.request<Token[]>({
    url: `/tokens`,
    method: 'POST',
    data: values
  });

  return data;
};

export const getUserTokens = async (values: Partial<User>): Promise<Token[]> => {
  const { id } = values;
  const { data } = await MyriadAPI.request<Token[]>({
    url: `/users/${id}/tokens`,
    method: 'GET'
  });

  return data;
};

export const addUserToken = async (values: NewAssetProps): Promise<Token[]> => {
  const { data } = await MyriadAPI.request<Token[]>({
    url: `/user-tokens`,
    method: 'POST',
    data: values
  });

  return data;
};
