import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import NoSsr from '@material-ui/core/NoSsr';

import {BalanceDetailList} from '.';

import {AddCoin} from 'src/components/atoms/AddCoin/AddCoin.component';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BalanceDetailListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const {balanceDetails} = usePolkadotApi();

  const {loading, currenciesId} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const [filteredBalances, setFilteredBalanced] = useState<BalanceDetail[]>([]);
  const [showAddCoin, setShowAddCoin] = useState(false);

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

  const handleRefresh = () => {
    dispatch(fetchBalances());
  };

  const toggleAddCoinModal = () => {
    setShowAddCoin(!showAddCoin);
  };

  if (!user) return null;

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
