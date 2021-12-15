import React from 'react';
import {useSelector} from 'react-redux';

import {SendTip} from '.';
import {WalletState} from '../../reducers/wallet/reducer';
import {BalanceDetail} from '../MyWallet';

import _ from 'lodash';
import {CurrencyId} from 'src/interfaces/currency';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const SendTipContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const {tippedUserId, tippedUser} = useSelector<RootState, WalletState>(
    state => state.walletState,
  );

  if (!user) {
    return (
      <SendTip
        tippedUser={tippedUser}
        tippedUserId={tippedUserId}
        balanceDetails={balanceDetails}
      />
    );
  }

  const putDefaultFirst = (balanceDetails: BalanceDetail[], defaultCurrencyId: CurrencyId) => {
    const newDefaultCoins = [...balanceDetails];

    const defaultCoin = _.remove(newDefaultCoins, function (n) {
      return n.id === defaultCurrencyId;
    });

    const resultDefaultCoins = [...defaultCoin, ...newDefaultCoins];

    return resultDefaultCoins;
  };

  return (
    <SendTip
      tippedUser={tippedUser}
      tippedUserId={tippedUserId}
      balanceDetails={putDefaultFirst(balanceDetails, user.defaultCurrency)}
    />
  );
};
