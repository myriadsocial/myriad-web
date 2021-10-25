import React from 'react';
import {useSelector} from 'react-redux';

import {SendTip} from '.';
import {removeMyriad} from '../../helpers/balance';
import {WalletState} from '../../reducers/wallet/reducer';

import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

export const SendTipContainer: React.FC = () => {
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const {tippedUserId, tippedUser} = useSelector<RootState, WalletState>(
    state => state.walletState,
  );

  if (!tippedUser) return <p>loading</p>;

  return (
    <SendTip
      tippedUser={tippedUser}
      tippedUserId={tippedUserId}
      balanceDetails={removeMyriad(balanceDetails)}
    />
  );
};
