import React from 'react';

import { Typography, TypographyProps } from '@material-ui/core';

import { BN, BN_ZERO } from '@polkadot/util';

import { formatBalance } from 'src/helpers/balance';
import { BalanceDetail } from 'src/interfaces/balance';

type FormatCurrencyProps = TypographyProps & {
  value: BN;
  length?: number;
  currency: BalanceDetail;
  nativeSymbol: string;
  trxFee?: boolean;
};

export const FormatCurrency: React.FC<FormatCurrencyProps> = props => {
  const {
    value,
    length = 10,
    currency,
    nativeSymbol,
    trxFee = false,
    ...restProps
  } = props;

  const decimal = trxFee ? 18 : currency.decimal;
  const symbol = trxFee ? nativeSymbol : currency.symbol;
  const amount = formatBalance(value, decimal, length);
  const displayAmount = value.gt(BN_ZERO)
    ? amount > 0
      ? amount
      : '< 0.00000001'
    : 0;

  return (
    <Typography component="span" {...restProps}>
      {displayAmount}
      &nbsp;
      {symbol}
    </Typography>
  );
};
