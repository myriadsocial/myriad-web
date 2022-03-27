import React from 'react';
import {useSelector} from 'react-redux';

import {PrimaryCoinMenu} from '.';
import {UserState} from '../../reducers/user/reducer';

import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

type PrimaryCoinMenuContainer = {
  togglePrimaryCoinMenu: () => void;
};

export const PrimaryCoinMenuContainer: React.FC<PrimaryCoinMenuContainer> = props => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const {togglePrimaryCoinMenu} = props;

  const {balanceDetails, currenciesId} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  if (!user) return null;

  return (
    <PrimaryCoinMenu
      togglePrimaryCoinMenu={togglePrimaryCoinMenu}
      balanceDetails={balanceDetails}
      user={user}
      currenciesId={currenciesId}
    />
  );
};
