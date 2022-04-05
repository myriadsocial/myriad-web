import React from 'react';

import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 360,
    },
  }),
);

export const WalletBalances: React.FC<WalletProps> = ({balances}) => {
  const styles = useStyles();

  const router = useRouter();

  const changeToWalletPage = () => {
    router.push('/wallet');
  };

  return (
    <BoxComponent title="Wallet" onClick={changeToWalletPage} className={styles.root}>
      {/**handle loading when fetching balance**/}
      {balances.length === 0 && (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      )}
      {balances.map(balance => (
        <ListItemComponent
          key={balance.id}
          title={balance.symbol}
          avatar={balance.image}
          action={
            <Typography variant="h5">{parseFloat(balance.freeBalance.toFixed(4))}</Typography>
          }
        />
      ))}
    </BoxComponent>
  );
};
