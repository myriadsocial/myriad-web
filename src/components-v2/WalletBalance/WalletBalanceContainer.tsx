import React from 'react';
import {useSelector} from 'react-redux';

import {WalletBalances as WalletBalancesComponent} from '.';
import {RootState} from '../../reducers/';

import {BalanceState} from 'src/reducers/balance/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  return <WalletBalancesComponent balances={balanceDetails} />;
};
