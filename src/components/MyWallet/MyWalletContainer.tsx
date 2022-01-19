import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {MyWallet} from '.';

import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const MyWalletContainer: React.FC = () => {
  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {loadExchangeRate} = useExchangeRate();

  const {loading} = usePolkadotApi();

  if (!user || loading) return null;

  useEffect(() => {
    loadExchangeRate();
  }, [currencies, user]);

  return <MyWallet headerTitle={'Wallet'} />;
};

export default MyWalletContainer;
