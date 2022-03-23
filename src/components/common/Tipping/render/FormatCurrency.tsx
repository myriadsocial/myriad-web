import React from 'react';

import {Typography, TypographyProps} from '@material-ui/core';

import {BN, BN_ZERO, formatBalance} from '@polkadot/util';

import {BalanceDetail} from 'src/interfaces/balance';

type FormatCurrencyProps = TypographyProps & {
  value: BN;
  currency: BalanceDetail;
};

export const FormatCurrency: React.FC<FormatCurrencyProps> = props => {
  const {value, currency, ...restProps} = props;

  const amount = value.gt(BN_ZERO)
    ? parseFloat(formatBalance(value, {decimals: currency.decimal, forceUnit: '-', withSi: false}))
    : '-';

  return (
    <Typography component="span" {...restProps}>
      {amount}
      &nbsp;
      {currency.id}
    </Typography>
  );
};
