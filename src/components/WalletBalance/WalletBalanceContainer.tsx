import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';

import {WalletBalances as WalletBalancesComponent} from '.';
import {BoxComponent} from '../atoms/Box';

import {BalanceDetail} from 'src/interfaces/balance';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails, loading} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const status = router.query.status as string;
  const [balances, setBalances] = useState<BalanceDetail[]>([]);

  useEffect(() => {
    if (balanceDetails.length === 0) {
      dispatch(fetchBalances(true, status));
    } else {
      setBalances(balanceDetails);
    }
  }, [balanceDetails, status]);

  if (anonymous)
    return (
      <BoxComponent title={i18n.t('Wallet.Header')}>
        <Typography>{i18n.t('Wallet.Anonymous')}</Typography>
      </BoxComponent>
    );

  return <WalletBalancesComponent balances={balances} loading={loading} />;
};

export default WalletBalancesContainer;
