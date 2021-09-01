import React from 'react';

<<<<<<< HEAD
import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BalanceDetail} from '../../interfaces/balance';
import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';
=======
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BoxComponent} from 'src/componentsV2/common/Box';
import {BalanceDetail} from 'src/interfaces/balance';
>>>>>>> da15b546 (MYR-703: box component)

type WalletProps = {
  balances: Array<BalanceDetail>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
<<<<<<< HEAD
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 360,
    },
=======
>>>>>>> da15b546 (MYR-703: box component)
  }),
);

export const WalletBalances: React.FC<WalletProps> = ({balances}) => {
  const styles = useStyles();

<<<<<<< HEAD
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
          title={balance.id}
          avatar={balance.image}
          action={<Typography variant="h5">{balance.freeBalance}</Typography>}
        />
      ))}
    </BoxComponent>
  );
=======
  return <BoxComponent title="Wallet">hi</BoxComponent>;
>>>>>>> da15b546 (MYR-703: box component)
};
