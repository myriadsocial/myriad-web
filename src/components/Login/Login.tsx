import React, {useState, useCallback} from 'react';
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';

import {CircularProgress} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import ShowIf from '../common/show-if.component';
import {useStyles} from './Login.styles';
import {Accounts} from './render/Accounts';
import {Login as LoginComponent} from './render/Login';
import {Options} from './render/Options';
import {Profile} from './render/Profile';

import {useAuthHook} from 'src/hooks/auth.hook';
import {useProfileHook} from 'src/hooks/use-profile.hook';

export const Login: React.FC = () => {
  const styles = useStyles();

  const {anonymous, fetchUserNonce, signInWithExternalAuth} = useAuthHook();
  const {checkUsernameAvailable} = useProfileHook();

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [signatureCancelled, setSignatureCancelled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnconnect = (accounts: InjectedAccountWithMeta[]) => {
    setAccounts(accounts);
  };

  const handleSelectedAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
  };

  const switchAccount = async (account: InjectedAccountWithMeta, callback: () => void) => {
    handleSelectedAccount(account);

    checkAccountRegistered(callback, account);
  };

  const checkAccountRegistered = useCallback(
    async (callback: () => void, account?: InjectedAccountWithMeta) => {
      const currentAccount = account ?? selectedAccount;

      if (currentAccount) {
        setLoading(true);
        setSignatureCancelled(false);

        const {nonce} = await fetchUserNonce(currentAccount);

        if (nonce > 0) {
          const success = await signInWithExternalAuth(currentAccount, nonce);

          if (!success) {
            setSignatureCancelled(true);
            setLoading(false);
          }
        } else {
          // register
          setLoading(false);
          callback();
        }
      }
    },
    [selectedAccount],
  );

  return (
    <div className={styles.root}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginComponent anonymousLogin={anonymous} switchAccount={switchAccount} />}
          />
          <Route path="/wallet" element={<Options onConnect={handleOnconnect} />} />
          <Route
            path="/account"
            element={
              <Accounts
                accounts={accounts}
                onSelect={handleSelectedAccount}
                onNext={checkAccountRegistered}
                signature={signatureCancelled}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                account={selectedAccount}
                checkUsernameAvailability={checkUsernameAvailable}
              />
            }
          />
        </Routes>
      </Router>

      <ShowIf condition={loading}>
        <CircularProgress size={40} className={styles.loading} />
      </ShowIf>
    </div>
  );
};

export default Login;
