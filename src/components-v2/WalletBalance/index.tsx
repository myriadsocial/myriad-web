import React from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BoxComponent} from 'src/componentsV2/common/Box';
import {BalanceDetail} from 'src/interfaces/balance';

type WalletProps = {
  balances: Array<BalanceDetail>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
);

export const WalletBalances: React.FC<WalletProps> = ({balances}) => {
  const styles = useStyles();

  return <BoxComponent title="Wallet">hi</BoxComponent>;
};
