import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ChooseAccountComponent } from './modal-accounts.component';
import { NoExtensionComponent } from './modal-no-extension.component';

import { useAuthHook } from 'src/hooks/auth.hook';
import { usePolkadotExtension } from 'src/hooks/use-polkadot-app.hook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 678,
      background: 'linear-gradient(117.69deg, rgba(112, 112, 112, 0.2) 60.66%, rgba(203, 203, 203, 0) 114.57%)',
      backdropFilter: 'blur(24px)',
      /* Note: backdrop-filter has minimal browser support */
      borderColor: '#696969',
      borderRadius: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 8,
      marginBottom: 42
    },
    form: {
      width: 444,
      padding: 24
    },
    signIn: {
      padding: theme.spacing(1),
      height: 48,
      fontSize: 16,
      fontWeight: 600
    },
    anonymous: {
      background: theme.palette.text.secondary,
      color: '#2998E9',
      height: 48,
      fontSize: 16,
      fontWeight: 600
    },
    help: {
      padding: theme.spacing(1),
      textAlign: 'center',
      maxWidth: 390,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 16,
      fontWeight: 600,
      fontStyle: 'normal',
      lineHeight: '20px',
      color: theme.palette.text.secondary,
      textDecoration: 'underline',
      marginBottom: 40
    },
    polkadot: {
      color: 'rgb(255, 140, 0)'
    }
  })
);

type LoginComponentProps = {};

export const LoginComponent: React.FC<LoginComponentProps> = props => {
  const style = useStyles();

  const { enablePolkadotExtension, getPolkadotAccounts } = usePolkadotExtension();
  const { signInWithAccount, anonymous } = useAuthHook();

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
      <div className={style.form}>
        <Button onClick={checkExtensionInstalled} variant="contained" color="primary" size="large" fullWidth className={style.signIn}>
          Sign in
        </Button>

        <Button className={style.anonymous} variant="contained" fullWidth size="large" onClick={anonymous}>
          Anonymous Login
        </Button>
      </div>

      <div>
        <Typography className={style.help}>
          Make sure you already have{' '}
          <Link href="https://polkadot.js.org/extension" target="_blank" className={style.polkadot}>
            Polkadot.js
          </Link>{' '}
          extension installed on your browser
        </Typography>
      </div>

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
