import React from 'react';
import { useSelector } from 'react-redux';

import { Typography } from '@material-ui/core';

import { WalletBalances as WalletBalancesComponent } from '.';
import { BoxComponent } from '../atoms/Box';

import { InfoIconYellow } from 'src/images/Icons';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { BalanceState } from 'src/reducers/balance/reducer';
import { UserState } from 'src/reducers/user/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const { anonymous } = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const { balanceDetails, loading } = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  if (anonymous)
    return (
      <BoxComponent title={i18n.t('Wallet.Header')}>
        <div
          style={{
            backgroundColor: '#ffc85726',
            padding: 10,
            borderRadius: 8,
            fontSize: 14,
            display: 'flex',
            alignItems: 'start',
            marginBottom: 16,
          }}>
          <div style={{ marginRight: 8, marginTop: 4 }}>
            <InfoIconYellow />
          </div>
          <Typography>{i18n.t('Wallet.Anonymous')}</Typography>
        </div>
      </BoxComponent>
    );

  return (
    <WalletBalancesComponent balances={balanceDetails} loading={loading} />
  );
};

export default WalletBalancesContainer;
