import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {Currency, UserCurrency, UserCurrencyProps} from 'src/interfaces/currency';

type CurrencyList = BaseList<Currency>;
type UserCurrencyList = BaseList<UserCurrency>;

export const getTokens = async (): Promise<CurrencyList> => {
  const {data} = await MyriadAPI().request<CurrencyList>({
    url: '/currencies',
    method: 'GET',
  });

  return data;
};

export const addUserToken = async (values: UserCurrencyProps): Promise<Currency> => {
  const {data} = await MyriadAPI().request<Currency>({
    url: `/user-currencies`,
    method: 'POST',
    data: values,
  });

  return data;
};

export const getUserCurrencies = async (userId: string): Promise<UserCurrencyList> => {
  const {data} = await MyriadAPI().request<UserCurrencyList>({
    url: '/user-currencies',
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

export const updateCurrencySet = async (
  userId: string,
  currenciesId: string[],
  networkId: string,
): Promise<void> => {
  await MyriadAPI().request({
    url: `/user-currencies`,
    method: 'PATCH',
    data: {
      networkId: networkId,
      userId: userId,
      currencyIds: currenciesId,
    },
  });
};
