import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import NoSsr from '@material-ui/core/NoSsr';

import {BalanceDetailList} from '.';

import {BalanceDetail} from 'src/components/MyWallet';
import {AddCoin} from 'src/components/atoms/AddCoin/AddCoin.component';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BalanceDetailListContainer: React.FC = () => {
  const {loading, balanceDetails, currenciesId} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );
  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);

  if (!user) return null;

  const {load} = usePolkadotApi();

  const [showAddCoin, setShowAddCoin] = useState(false);

  const handleFilterCurrencies = () => {
    const data: BalanceDetail[] | [] = [];
    if (currenciesId.length) {
      balanceDetails.forEach(coin => {
        data[currenciesId.indexOf(coin.id)] = coin;
      });
    } else {
      return balanceDetails;
    }

    return data;
  };

  const [filteredBalances, setFilteredBalanced] = useState(handleFilterCurrencies());

  useEffect(() => {
    setFilteredBalanced(handleFilterCurrencies());
  }, [balanceDetails, currenciesId]);

  const handleRefresh = () => {
    load(user?.id, currencies);
  };

  const toggleAddCoinModal = () => {
    setShowAddCoin(!showAddCoin);
  };

  return (
    <NoSsr>
      <BalanceDetailList
        balanceDetails={filteredBalances}
        isLoading={loading}
        onClickRefresh={handleRefresh}
        onClickAddCoin={toggleAddCoinModal}
      />

      <AddCoin open={showAddCoin} onClose={toggleAddCoinModal} />
    </NoSsr>
  );
};
