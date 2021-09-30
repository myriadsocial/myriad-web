import React from 'react';
import {useSelector} from 'react-redux';

import {BalanceDetailList} from '.';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BalanceDetailListContainer: React.FC = () => {
  const {loading, balanceDetails} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);

  const {load} = usePolkadotApi();

  if (!user) return null;

  const handleRefresh = () => {
    load(user?.id, currencies);
  };

  return (
    <BalanceDetailList
      balanceDetails={balanceDetails}
      isLoading={loading}
      onClickRefresh={handleRefresh}
    />
  );
};
