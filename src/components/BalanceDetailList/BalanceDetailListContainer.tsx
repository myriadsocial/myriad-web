import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import NoSsr from '@material-ui/core/NoSsr';

import {BalanceDetailList} from '.';

import {AddCoin} from 'src/components/atoms/AddCoin/AddCoin.component';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BalanceDetailListContainer: React.FC = () => {
  const {loading, balanceDetails} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  if (!user) return null;

  const {load} = usePolkadotApi();

  const [showAddCoin, setShowAddCoin] = useState(false);

  const handleRefresh = () => {
    load(user?.id, currencies);
  };

  const toggleAddCoinModal = () => {
    setShowAddCoin(!showAddCoin);
  };

  return (
    <NoSsr>
      <BalanceDetailList
        balanceDetails={balanceDetails}
        isLoading={loading}
        onClickRefresh={handleRefresh}
        onClickAddCoin={toggleAddCoinModal}
      />

      <AddCoin open={showAddCoin} onClose={toggleAddCoinModal} />
    </NoSsr>
  );
};
