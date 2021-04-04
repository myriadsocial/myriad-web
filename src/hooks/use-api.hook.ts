import Axios, { AxiosRequestConfig } from 'axios';
import useAxios, { configure } from 'axios-hooks';
import LRU from 'lru-cache';

export type BasePaginationParam = {
  offset?: number;
  limit?: number;
  skip?: number;
  order?: string;
};

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

const cache = new LRU({ max: 10 });

configure({ axios, cache });

export const useApi = (path: string, params?: AxiosRequestConfig) => {
  const [{ data, loading, error }, refetch] = useAxios({
    url: path,
    params
  });

  return {
    refetch,
    data,
    loading,
    error
  };
};
