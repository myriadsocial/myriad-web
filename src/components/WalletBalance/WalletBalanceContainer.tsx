import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';

import {WalletBalances as WalletBalancesComponent} from '.';
import {usePolkadotApi} from '../../hooks/use-polkadot-api.hook';
import {RootState} from '../../reducers';
import {UserState} from '../../reducers/user/reducer';
import {BoxComponent} from '../atoms/Box';

import {BalanceState} from 'src/reducers/balance/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const {user, currencies, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const {load} = usePolkadotApi();

  useEffect(() => {
    if (user) load(user.id, currencies);
  }, [currencies, user]);

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  if (anonymous)
    return (
      <BoxComponent title="Wallet">
        <Typography>Please Login with polkadot account to access this feature</Typography>
      </BoxComponent>
    );

  return <WalletBalancesComponent balances={balanceDetails} />;
};

export default WalletBalancesContainer;
