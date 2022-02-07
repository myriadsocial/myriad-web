import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {Button, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Login.style';

import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {toHexPublicKey} from 'src/lib/crypto';
import i18n from 'src/locale';

type LoginProps = {
  anonymousLogin: () => void;
  switchAccount: (account: InjectedAccountWithMeta, callback: () => void) => void;
};

export const Login: React.FC<LoginProps> = props => {
  const styles = useStyles();

  const {anonymousLogin, switchAccount} = props;

  const navigate = useNavigate();
  const {query} = useQueryParams();
  const {enablePolkadotExtension, getPolkadotAccounts} = usePolkadotExtension();

  useEffect(() => {
    if (query.address) {
      const address: string = Array.isArray(query.address) ? query.address[0] : query.address;

      selectAccountFromParam(address);
    }
  }, [query]);

  const selectAccountFromParam = async (address: string) => {
    await enablePolkadotExtension();

    const polkadotAccounts = await getPolkadotAccounts();

    const account = polkadotAccounts.find(acc => toHexPublicKey(acc) === address);

    if (account) {
      switchAccount(account, () => {
        navigate('/profile');
      });
    }
  };

  const chooseWallet = () => {
    navigate('/wallet');
  };

  return (
    <div className={styles.root}>
      <Button className={styles.button} color="default" variant="contained" onClick={chooseWallet}>
        {i18n.t('Login.Layout.Btn_Signin')}
      </Button>
      <Typography className={styles.span} component="span" variant="h4" color="textPrimary">
        {i18n.t('Login.Layout.Text_Try_1')}&nbsp;
        <Button className={styles.link} onClick={anonymousLogin} component="span">
          {i18n.t('Login.Layout.Btn_Demo')}
        </Button>
        &nbsp;{i18n.t('Login.Layout.Text_Try_2')}&nbsp;
        <span role="img" aria-label="emoticon-peace">
          ✌️
        </span>
      </Typography>

      <Typography component="span" variant="h5">
        {i18n.t('Login.Layout.Footer_Text_1')}{' '}
        <a
          href={'https://polkadot.js.org/extension/'}
          className={styles.polkadotLink}
          target="_blank"
          rel="noreferrer">
          Polkadot.js
        </a>
        {i18n.t('Login.Layout.Footer_Text_2')}{' '}
        <span role="img" aria-label="emoticon-computer">
          💻
        </span>
      </Typography>
    </div>
  );
};
