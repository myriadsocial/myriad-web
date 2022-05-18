import MyriadAPI from './base';

import {ExchangeRate} from 'src/interfaces/exchange';

export const getExchangeRate = async (): Promise<ExchangeRate[]> => {
  const {data} = await MyriadAPI().request<ExchangeRate[]>({
    url: `/exchange-rates`,
    method: 'GET',
  });

  return data;
};

export const getExchangeRateById = async (currencyId: string): Promise<ExchangeRate> => {
  const {data} = await MyriadAPI().request<ExchangeRate>({
    url: `/exchange-rates/${currencyId}`,
    method: 'GET',
  });

  return data;
};
