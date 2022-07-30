import React from 'react';
import {useSelector} from 'react-redux';

import {MyWallet} from '.';
import {useStyles} from './myWallet.style';

import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const MyWalletContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const style = useStyles();

  if (!user) return null;

  return (
    <div className={style.root}>
      <MyWallet headerTitle={i18n.t('Wallet.Header')} />
    </div>
  );
};

export default MyWalletContainer;
