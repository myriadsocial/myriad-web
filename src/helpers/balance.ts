import {BalanceDetail} from '../interfaces/balance';
import {CurrencyId} from '../interfaces/currency';

import _ from 'lodash';

// TODO: check if needs to be removed
export const formatNumber = (number: number, decimals: number): number => {
  if (number.toString() === '0') return 0;
  const result = Number((Number(number.toString()) / 10 ** decimals).toFixed(5));
  return result;
};

// TODO: check if needs to be removed
export const formatUsd = (value: number, conversion: number): string => {
  if (value * conversion === 0) return '';
  return (value * conversion).toFixed(2);
};

export const removeMyriad = (balanceDetails: BalanceDetail[]): BalanceDetail[] => {
  const newCoins = [...balanceDetails];

  const myriadlessCoins = _.remove(newCoins, function (n) {
    return n.id !== CurrencyId.MYRIA;
  });

  return myriadlessCoins;
};
