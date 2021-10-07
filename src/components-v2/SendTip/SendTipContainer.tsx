import React from 'react';
import {useSelector} from 'react-redux';

import {SendTip} from '.';
import {removeMyriad} from '../../helpers/balance';

import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

export const SendTipContainer: React.FC = () => {
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  return <SendTip balanceDetails={removeMyriad(balanceDetails)} />;
};
