import React from 'react';

import {Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BalanceDetail} from '../../interfaces/balance';
import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';

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

  return (
    <BoxComponent title="Wallet" className={styles.root}>
      {balances.map(balance => (
        <ListItemComponent
          key={balance.tokenSymbol}
          title={balance.tokenSymbol}
          avatar={balance.tokenImage}
          action={<Typography variant="h5">{balance.freeBalance}</Typography>}
        />
      ))}
    </BoxComponent>
  );
};
