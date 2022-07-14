import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import NoSsr from '@material-ui/core/NoSsr';

import {BalanceDetailList} from '.';
import {BoxComponent} from '../atoms/Box';

import {AddCoin} from 'src/components/atoms/AddCoin/AddCoin.component';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {BlockchainPlatform} from 'src/interfaces/wallet';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BalanceDetailListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const {balanceDetails: polkadotBalance} = usePolkadotApi();
  const {balanceDetails: nearBalance} = useNearApi();

  const {loading, currenciesId} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {user, currentWallet} = useSelector<RootState, UserState>(state => state.userState);

  const [filteredBalances, setFilteredBalanced] = useState<BalanceDetail[]>([]);
  const [showAddCoin, setShowAddCoin] = useState(false);

  useEffect(() => {
    handleFilterCurrencies();
  }, [polkadotBalance, nearBalance, currenciesId]);

  const handleFilterCurrencies = (): void => {
    if (currenciesId.length) {
      if (currentWallet?.network?.blockchainPlatform === BlockchainPlatform.SUBSTRATE) {
        const data: BalanceDetail[] = [];

        polkadotBalance.forEach(coin => {
          data[currenciesId.indexOf(coin.id)] = coin;
        });
        setFilteredBalanced(data);
      } else if (currentWallet?.network?.blockchainPlatform === BlockchainPlatform.NEAR) {
        //TODO need to filtered by currenciesId from backend
        const data: BalanceDetail[] = [];

        nearBalance.forEach(coin => {
          data[currenciesId.indexOf(coin.id)] = coin;
        });
        setFilteredBalanced(data);
      }
    } else {
      if (currentWallet?.network?.blockchainPlatform === BlockchainPlatform.SUBSTRATE) {
        setFilteredBalanced(polkadotBalance);
      } else if (currentWallet?.network?.blockchainPlatform === BlockchainPlatform.NEAR) {
        setFilteredBalanced(nearBalance);
      }
    }
  };

  const handleRefresh = () => {
    dispatch(fetchBalances(true));
  };

  const toggleAddCoinModal = () => {
    setShowAddCoin(!showAddCoin);
  };

  if (!user) return null;

  return (
    <NoSsr>
      <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
        <BalanceDetailList
          balanceDetails={filteredBalances}
          isLoading={loading}
          onClickRefresh={handleRefresh}
          onClickAddCoin={toggleAddCoinModal}
        />

        <AddCoin open={showAddCoin} onClose={toggleAddCoinModal} />
      </BoxComponent>
    </NoSsr>
  );
};

export default BalanceDetailListContainer;
