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
import {WalletTypeEnum} from 'src/lib/api/ext-auth';

export const Login: React.FC = () => {
  const styles = useStyles();

  const {anonymous, fetchUserNonce, fetchNearUserNonce, signInWithExternalAuth} = useAuthHook();
  const {checkUsernameAvailable} = useProfileHook();

  const [walletType, setWalletType] = useState<WalletTypeEnum | null>(null);

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [publicAddress, setPublicAddress] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [signatureCancelled, setSignatureCancelled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnconnect = (accounts: InjectedAccountWithMeta[]) => {
    setAccounts(accounts);
    setWalletType(WalletTypeEnum.POLKADOT);
  };

  const handleOnConnectNear = (nearId: string, callback: () => void) => {
    setPublicAddress(nearId);
    setWalletType(WalletTypeEnum.NEAR);

    checkAccountRegistered(callback, WalletTypeEnum.NEAR, undefined, nearId);
  };

  const handleSelectedAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
  };

  const switchAccount = async (account: InjectedAccountWithMeta, callback: () => void) => {
    handleSelectedAccount(account);

    checkAccountRegistered(callback, WalletTypeEnum.POLKADOT, account);
  };

  const checkAccountRegistered = useCallback(
    async (
      callback: () => void,
      walletType?: WalletTypeEnum,
      account?: InjectedAccountWithMeta,
      nearId?: string,
    ) => {
      switch (walletType) {
        case WalletTypeEnum.POLKADOT:
          {
            const currentAccount = account ?? selectedAccount;

            if (currentAccount) {
              setLoading(true);
              setSignatureCancelled(false);

              const {nonce} = await fetchUserNonce(currentAccount);

              console.log({nonce});

              if (nonce > 0) {
                const success = await signInWithExternalAuth(nonce, currentAccount);

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
          }
          break;

        case WalletTypeEnum.NEAR: {
          if (nearId) {
            const {nonce} = await fetchNearUserNonce(nearId);
            if (nonce > 0) {
              const success = await signInWithExternalAuth(nonce, undefined, nearId);

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
          break;
        }

        default:
          break;
      }
    },
    [selectedAccount, walletType, publicAddress],
  );

  return (
    <div className={styles.root}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginComponent anonymousLogin={anonymous} switchAccount={switchAccount} />}
          />
          <Route
            path="/wallet"
            element={<Options onConnect={handleOnconnect} onConnectNear={handleOnConnectNear} />}
          />
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
                walletType={walletType}
                publicAddress={publicAddress}
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
