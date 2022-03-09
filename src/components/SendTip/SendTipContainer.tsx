import React from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {remove} from 'lodash';
import {BalanceDetail} from 'src/interfaces/balance';
import {CurrencyId} from 'src/interfaces/currency';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';
import {WalletState} from 'src/reducers/wallet/reducer';

const SendTip = dynamic(() => import('./SendTip'), {ssr: false});

export const SendTipContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {tippedUserId, tippedUser} = useSelector<RootState, WalletState>(
    state => state.walletState,
  );

  const defaultCurrencyId: CurrencyId | null = user?.defaultCurrency ?? null;

  // TODO: sort balance when updating balanceDetails on BalanceState
  const putDefaultFirst = (balanceDetails: BalanceDetail[]) => {
    if (!defaultCurrencyId) return balanceDetails;

    const newDefaultCoins = [...balanceDetails];

    const defaultCoin = remove(newDefaultCoins, balance => balance.id === defaultCurrencyId);

    return [...defaultCoin, ...newDefaultCoins];
  };

  return (
    <SendTip
      tippedUser={tippedUser}
      tippedUserId={tippedUserId}
      balanceDetails={putDefaultFirst(balanceDetails)}
    />
  );
};

export default SendTipContainer;
