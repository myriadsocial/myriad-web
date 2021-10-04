import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import NoSsr from '@material-ui/core/NoSsr';

import {MyWallet} from '.';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const MyWalletContainer: React.FC = () => {
  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);

  const {load} = usePolkadotApi();

  if (!user) return null;

  useEffect(() => {
    load(user?.id, currencies);
  }, [currencies, user]);

  return (
    <NoSsr>
      <MyWallet headerTitle={'Wallet'} />
    </NoSsr>
  );
};

export default MyWalletContainer;
