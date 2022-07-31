import React from 'react';

import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BalanceDetail} from '../../interfaces/balance';
import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';

import ShowIf from 'components/common/show-if.component';
import i18n from 'src/locale';

type WalletProps = {
  balances: Array<BalanceDetail>;
  loading: boolean;
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

export const WalletBalances: React.FC<WalletProps> = ({balances, loading}) => {
  const styles = useStyles();

  const router = useRouter();

  const changeToWalletPage = () => {
    router.push('/wallet');
  };

  return (
    <BoxComponent
      title={i18n.t('Wallet.Header')}
      onClick={changeToWalletPage}
      className={styles.root}>
      {/**handle loading when fetching balance**/}
      <ShowIf condition={loading}>
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      </ShowIf>

      <ShowIf condition={!loading}>
        {balances.map(balance => (
          <ListItemComponent
            key={balance.id}
            title={balance.symbol}
            avatar={balance.image}
            action={
              <Typography variant="h5">
                {typeof balance.freeBalance === 'number'
                  ? parseFloat(balance?.freeBalance.toFixed(4))
                  : 'NaN'}
              </Typography>
            }
          />
        ))}
      </ShowIf>
    </BoxComponent>
  );
};
