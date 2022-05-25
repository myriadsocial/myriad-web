import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';

import {WalletBalances as WalletBalancesComponent} from '.';
import {BoxComponent} from '../atoms/Box';

import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import i18n from 'src/locale';
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
      if (currentWallet?.network?.blockchainPlatform === 'substrate') {
        const data: BalanceDetail[] = [];

        polkadotBalance.forEach(coin => {
          data[currenciesId.indexOf(coin.id)] = coin;
        });

        setFilteredBalanced(data);
      } else if (currentWallet?.network?.blockchainPlatform === 'near') {
        //TODO need to filtered by currenciesId from backend
        setFilteredBalanced(nearBalance);
      }
    } else {
      if (currentWallet?.network?.blockchainPlatform === 'substrate') {
        setFilteredBalanced(polkadotBalance);
      } else if (currentWallet?.network?.blockchainPlatform === 'near') {
        setFilteredBalanced(nearBalance);
      }
    }
  };

  if (anonymous)
    return (
      <BoxComponent title={i18n.t('Wallet.Header')}>
        <Typography>{i18n.t('Wallet.Anonymous')}</Typography>
      </BoxComponent>
    );

  return <WalletBalancesComponent balances={filteredBalances} />;
};

export default WalletBalancesContainer;
