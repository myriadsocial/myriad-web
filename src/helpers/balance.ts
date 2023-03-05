import { BN } from '@polkadot/util/bn';

import { BalanceDetail } from '../interfaces/balance';
import { CurrencyId } from '../interfaces/currency';

import remove from 'lodash/remove';

// TODO: check if needs to be removed
export const formatNumber = (number: number, decimals: number): number => {
  if (number.toString() === '0') return 0;
  const result = Number(
    (Number(number.toString()) / 10 ** decimals).toFixed(5),
  );
  return result;
};

// TODO: check if needs to be removed
export const formatUsd = (value: number, conversion: number): string => {
  if (value * conversion === 0) return '';
  return (value * conversion).toFixed(2);
};

export const removeMyriad = (
  balanceDetails: BalanceDetail[],
): BalanceDetail[] => {
  const newCoins = [...balanceDetails];

  const myriadlessCoins = remove(newCoins, function (n) {
    return n.id !== CurrencyId.MYRIA;
  });

  return myriadlessCoins;
};

export const formatBalance = (
  value: BN | string,
  decimal: number,
  length = 10,
): string => {
  if (isNaN(Number(value))) return '0';

  const val = value.toString();

  let trailingZero = '';
  let div = val.substring(0, val.length - decimal);
  let mod = val.substring(val.length - decimal).replace(/0+$/, '');

  if (val.length <= decimal) {
    if (val.length === decimal) {
      div = '0';
    } else {
      trailingZero = '0'.repeat(decimal - val.length);
      mod = trailingZero + mod;
    }
  }

  let maxDecimal = length;

  if (div === '0') {
    const updatedMod = Number(mod).toString();
    if (updatedMod.length <= length) {
      maxDecimal = mod.length;
    }
  }

  const amount = `${div}.${mod.slice(0, maxDecimal).replace(/0+$/, '')}`;

  return !Number(mod) ? div : amount;
};
