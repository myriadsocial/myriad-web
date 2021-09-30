import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {MyWallet} from '.';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {useTransaction} from 'src/hooks/use-transaction.hooks';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const MyWalletContainer: React.FC = () => {
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {transactions, loadInitTransaction} = useTransaction();

  const {load} = usePolkadotApi();

  useEffect(() => {
    loadInitTransaction();
  }, []);

  if (!user) return null;

  useEffect(() => {
    load(user?.id, currencies);
  }, [balanceDetails, currencies]);

  return (
    <MyWallet
      headerTitle={'Wallet'}
      balanceDetails={balanceDetails}
      historyDetails={transactions}
    />
  );
};
