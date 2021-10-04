import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {Currency, CurrencyProps} from 'src/interfaces/currency';

type UserCurrencyProps = {
  userId: string;
  currencyId: string;
};

type CurrencyList = BaseList<Currency>;

export const getTokens = async (): Promise<CurrencyList> => {
  const {data} = await MyriadAPI.request<CurrencyList>({
    url: '/currencies',
    method: 'GET',
  });

  return data;
};

export const searchToken = async (query: string): Promise<CurrencyList> => {
  const {data} = await MyriadAPI.request<CurrencyList>({
    url: `/currencies`,
    method: 'GET',
    params: {
      filter: {
        where: {
          name: {
            like: query,
          },
        },
      },
    },
  });

  return data;
};

export const addNewToken = async (values: CurrencyProps): Promise<Currency[]> => {
  const {data} = await MyriadAPI.request<Currency[]>({
    url: `/currencies`,
    method: 'POST',
    data: values,
  });

  return data;
};

export const addUserToken = async (values: UserCurrencyProps): Promise<Currency> => {
  const {data} = await MyriadAPI.request<Currency>({
    url: `/user-currencies`,
    method: 'POST',
    data: values,
  });

  return data;
};

export const setDefaultCurrency = async (values: UserCurrencyProps): Promise<string | null> => {
  const {userId, currencyId} = values;
  const {status: statusCode} = await MyriadAPI.request<Currency>({
    url: `/users/${userId}/select-currency/${currencyId}`,
    method: 'PATCH',
  });

  if (statusCode === 204) {
    return currencyId;
  } else {
    return null;
  }
};
