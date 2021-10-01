import React from 'react';
import {useSelector} from 'react-redux';

import {PrimaryCoinMenu} from '.';

import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

type PrimaryCoinMenuContainer = {
  togglePrimaryCoinMenu: () => void;
};

export const PrimaryCoinMenuContainer: React.FC<PrimaryCoinMenuContainer> = props => {
  const {togglePrimaryCoinMenu} = props;

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  if (!user) return null;

  // User should have defaultCurrency
  if (!user.defaultCurrency) return null;

  return (
    <PrimaryCoinMenu
      togglePrimaryCoinMenu={togglePrimaryCoinMenu}
      balanceDetails={balanceDetails}
      defaultCurrency={user.defaultCurrency}
    />
  );
};
