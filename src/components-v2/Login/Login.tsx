import React, {useEffect, useState} from 'react';

import {Button, Link, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useAuthHook} from '../../hooks/auth.hook';
import {usePolkadotExtension} from '../../hooks/use-polkadot-app.hook';
import {PolkadotAccountList} from '../PolkadotAccountList';
import {PromptComponent as Prompt} from '../atoms/Prompt/prompt.component';
import {useStyles} from './Login.styles';

export const Login: React.FC = () => {
  const styles = useStyles();

  const {enablePolkadotExtension, getPolkadotAccounts} = usePolkadotExtension();
  const {signInWithAccount, anonymous} = useAuthHook();

  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [signIn, setSignIn] = useState(false);

  useEffect(() => {
    if (extensionInstalled) {
      getAvailableAccounts();
    }
  }, [extensionInstalled]);

  const getAvailableAccounts = async () => {
    const accounts = await getPolkadotAccounts();

    setAccounts(accounts);
  };

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setSignIn(true);
    setExtensionInstalled(installed);
  };

  const toggleModal = () => {
    setSignIn(false);
  };

  return (
    <>
      <Button
        className={styles.button}
        color="default"
        variant="contained"
        onClick={checkExtensionInstalled}>
        Sign in
      </Button>
      <Typography className={styles.span} component="span" variant="h4" color="textPrimary">
        Or try our&nbsp;
        <Button className={styles.link} onClick={anonymous} component="span">
          demo
        </Button>
        &nbsp;first&nbsp;
        <span role="img" aria-label="emoticon-peace">
          ✌️
        </span>
      </Typography>

      <PolkadotAccountList
        isOpen={signIn && extensionInstalled}
        accounts={accounts}
        onSelect={signInWithAccount}
        onClose={toggleModal}
      />

      <Prompt
        title="Account Not Found"
        icon="warning"
        open={signIn && !extensionInstalled}
        onCancel={toggleModal}
        subtitle={
          <Typography>
            Kindly check if you have{' '}
            <Link
              href="https://polkadot.js.org/extension"
              target="_blank"
              className={styles.polkadot}>
              Polkadot.js
            </Link>{' '}
            installed on your browser
          </Typography>
        }>
        <Button size="small" variant="contained" color="primary" onClick={toggleModal}>
          Close
        </Button>
      </Prompt>
    </>
  );
};
