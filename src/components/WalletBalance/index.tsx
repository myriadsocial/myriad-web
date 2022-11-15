import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, Link, Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BalanceDetail} from '../../interfaces/balance';
import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';

import ShowIf from 'components/common/show-if.component';
import InfoIconYellow from 'src/images/Icons/InfoIconYellow.svg';
import {getTipStatus} from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

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
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [isHaveTips, setIsHaveTips] = useState<boolean>(false);
  const router = useRouter();

  const changeToWalletPage = () => {
    router.push('/wallet');
  };

  const checkStatusTips = async () => {
    const data = await getTipStatus();
    setIsHaveTips(data);
  };

  useEffect(() => {
    checkStatusTips();
  }, []);

  return (
    <BoxComponent
      title={i18n.t('Wallet.Header')}
      onClick={changeToWalletPage}
      className={styles.root}>
      <ShowIf condition={loading}>
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      </ShowIf>

      <ShowIf condition={!user.fullAccess && user.fullAccess !== undefined}>
        <div
          style={{
            backgroundColor: '#ffc85726',
            padding: 10,
            borderRadius: 8,
            fontSize: 14,
            display: 'flex',
            alignItems: 'start',
            marginBottom: 16,
          }}>
          <div style={{marginRight: 8, marginTop: 4}}>
            <InfoIconYellow />
          </div>
          {isHaveTips ? (
            <Typography>
              Someone sent you a tip! Connect your wallet now to claim your tip. You can check your
              tip balance{' '}
              <Link onClick={() => router.push({pathname: '/wallet', query: {type: 'tip'}})}>
                here
              </Link>{' '}
              and follow the instructions on how to claim it once your wallet is connected.
            </Typography>
          ) : (
            <Typography>
              You don’t have any wallet connected. Connect your wallet now to send tips.
            </Typography>
          )}
        </div>
        <Button variant="contained" color="primary" onClick={changeToWalletPage} fullWidth>
          Connect Wallet
        </Button>
      </ShowIf>

      <ShowIf condition={!loading && user.fullAccess}>
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
