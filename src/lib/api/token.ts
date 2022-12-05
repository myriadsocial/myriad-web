import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {Currency, UserCurrency} from 'src/interfaces/currency';

type CurrencyList = BaseList<Currency>;
type UserCurrencyList = BaseList<UserCurrency>;

export const getTokens = async (): Promise<CurrencyList> => {
  const {data} = await MyriadAPI().request<CurrencyList>({
    url: '/currencies',
    method: 'GET',
  });

  return data;
};

export const getUserCurrencies = async (userId: string): Promise<UserCurrencyList> => {
  const {data} = await MyriadAPI().request<UserCurrencyList>({
    url: '/user/currencies',
    method: 'GET',
    params: {
      filter: {
        order: `priority ASC`,
        where: {
          userId,
          priority: {gt: 0},
        },
      },
    },
  });

  return data;
};

export const updateCurrencySet = async (currencyIds: string[]): Promise<void> => {
  await MyriadAPI().request({
    url: `/user/currencies`,
    method: 'PATCH',
    data: {currencyIds},
  });
};

export const getFilteredTokens = async (filter, pageNumber, pageLimit): Promise<CurrencyList> => {
  const {data} = await MyriadAPI().request<CurrencyList>({
    url: '/currencies',
    method: 'GET',
    params: {
      pageNumber,
      pageLimit,
      filter,
    },
  });

  return data;
};
