import {Currency} from '../interfaces/currency';

export const formatNumber = (number: number, decimals: number): number => {
  if (number.toString() === '0') return 0;
  const result = Number((Number(number.toString()) / 10 ** decimals).toFixed(5));
  return result;
};

// TODO: implement conversion logic
export const formatUsd = (value: number, currency: Currency): number => {
  return value;
};
