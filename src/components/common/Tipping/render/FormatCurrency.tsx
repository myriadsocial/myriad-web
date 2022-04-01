import React from 'react';

import {Typography, TypographyProps} from '@material-ui/core';

import {BN} from '@polkadot/util';

import {formatBalance} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';

type FormatCurrencyProps = TypographyProps & {
  value: BN;
  precision?: number;
  currency: BalanceDetail;
};

export const FormatCurrency: React.FC<FormatCurrencyProps> = props => {
  const {value, precision = 10, currency, ...restProps} = props;

  const amount = formatBalance(value, currency.decimal, precision);

  return (
    <Typography component="span" {...restProps}>
      {amount}
      &nbsp;
      {currency.id}
    </Typography>
  );
};
