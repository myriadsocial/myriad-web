import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';

import {WalletBalances as WalletBalancesComponent} from '.';
import {BoxComponent} from '../atoms/Box';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const {balanceDetails} = usePolkadotApi();

  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {currenciesId} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const [filteredBalances, setFilteredBalanced] = useState<BalanceDetail[]>([]);

  useEffect(() => {
    handleFilterCurrencies();
  }, [balanceDetails, currenciesId]);

  const handleFilterCurrencies = (): void => {
    if (currenciesId.length) {
      const data: BalanceDetail[] = [];

      balanceDetails.forEach(coin => {
        data[currenciesId.indexOf(coin.id)] = coin;
      });

      setFilteredBalanced(data);
    } else {
      setFilteredBalanced(balanceDetails);
    }
  };

  if (anonymous)
    return (
      <BoxComponent title="Wallet">
        <Typography>Please Login with polkadot account to access this feature</Typography>
      </BoxComponent>
    );

  return <WalletBalancesComponent balances={filteredBalances} />;
};

export default WalletBalancesContainer;
