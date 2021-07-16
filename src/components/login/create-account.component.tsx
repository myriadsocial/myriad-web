import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ChooseAccountComponent } from './modal-accounts.component';
import { NoExtensionComponent } from './modal-no-extension.component';

import { useAuthHook } from 'src/hooks/auth.hook';
import { usePolkadotExtension } from 'src/hooks/use-polkadot-app.hook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1)
    },
    signIn: {
      padding: theme.spacing(0.5, 3),
      fontSize: 14,
      fontWeight: 500
    }
  })
);

type CreateAccountComponentProps = {};

export const CreateAccountComponent: React.FC<CreateAccountComponentProps> = props => {
  const style = useStyles();

  const { enablePolkadotExtension, getPolkadotAccounts } = usePolkadotExtension();
  const { signInWithAccount } = useAuthHook();

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
    <div className={style.root}>
      <Button onClick={checkExtensionInstalled} variant="contained" color="primary" size="medium" className={style.signIn}>
        Sign In
      </Button>

      <NoExtensionComponent isOpen={signIn && !extensionInstalled} onClose={toggleModal} />
      <ChooseAccountComponent
        isOpen={signIn && extensionInstalled}
        accounts={accounts}
        onSelect={signInWithAccount}
        onClose={toggleModal}
      />
    </div>
  );
};
