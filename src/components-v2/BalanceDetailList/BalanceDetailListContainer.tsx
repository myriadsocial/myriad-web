import React from 'react';
import {useSelector} from 'react-redux';

import {BalanceDetailList} from '.';

import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

export const BalanceDetailListContainer: React.FC = () => {
  const {loading, balanceDetails} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  return <BalanceDetailList balanceDetails={balanceDetails} isLoading={loading} />;
};
