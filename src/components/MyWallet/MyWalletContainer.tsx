import React from 'react';
import {useSelector} from 'react-redux';

import {MyWallet} from '.';
import {useStyles} from './myWallet.style';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const MyWalletContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const style = useStyles();
  const {loading} = usePolkadotApi();

  if (!user || loading) return null;

  return (
    <div className={style.root}>
      <MyWallet headerTitle={i18n.t('Wallet.Header')} />
    </div>
  );
};

export default MyWalletContainer;
