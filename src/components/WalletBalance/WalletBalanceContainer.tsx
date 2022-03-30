import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';

import {WalletBalances as WalletBalancesComponent} from '.';
import {BoxComponent} from '../atoms/Box';

import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {NetworkTypeEnum} from 'src/lib/api/ext-auth';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const {balanceDetails: polkadotBalance} = usePolkadotApi();
  const {balanceDetails: nearBalance} = useNearApi();

  const {anonymous, currentWallet} = useSelector<RootState, UserState>(state => state.userState);
  const {currenciesId} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const [filteredBalances, setFilteredBalanced] = useState<BalanceDetail[]>([]);

  useEffect(() => {
    handleFilterCurrencies();
  }, [polkadotBalance, nearBalance, currenciesId]);

  const handleFilterCurrencies = (): void => {
    if (currenciesId.length) {
      if (currentWallet?.type === NetworkTypeEnum.POLKADOT) {
        const data: BalanceDetail[] = [];

        polkadotBalance.forEach(coin => {
          data[currenciesId.indexOf(coin.id)] = coin;
        });

        setFilteredBalanced(data);
      } else if (currentWallet?.type === NetworkTypeEnum.NEAR) {
        //TODO need to filtered by currenciesId from backend
        setFilteredBalanced(nearBalance);
      }
    } else {
      if (currentWallet?.type === NetworkTypeEnum.POLKADOT) {
        setFilteredBalanced(polkadotBalance);
      } else if (currentWallet?.type === NetworkTypeEnum.NEAR) {
        setFilteredBalanced(nearBalance);
      }
    }
  };

  if (anonymous)
    return (
      <BoxComponent title="Wallet">
        <Typography>Please Login to access this feature</Typography>
      </BoxComponent>
    );

  return <WalletBalancesComponent balances={filteredBalances} />;
};

export default WalletBalancesContainer;
