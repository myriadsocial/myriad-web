import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {WalletBalances as WalletBalancesComponent} from '.';
import {usePolkadotApi} from '../../../src/hooks/use-polkadot-api.hook';
import {RootState} from '../../reducers/';
import {UserState} from '../../reducers/user/reducer';

import {BalanceState} from 'src/reducers/balance/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);

  const {load} = usePolkadotApi();

  if (!user) return null;

  useEffect(() => {
    load(user.id, currencies);
  }, [currencies, user]);

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  return <WalletBalancesComponent balances={balanceDetails} />;
};
