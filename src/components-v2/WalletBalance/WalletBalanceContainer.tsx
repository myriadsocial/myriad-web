import React from 'react';

import {WalletBalances as WalletBalancesComponent} from '.';
import {WalletBalances} from './WalletBalance.stories';

export const WalletBalancesContainer: React.FC = () => {
  return <WalletBalancesComponent balances={WalletBalances.args?.balances ?? []} />;
};
