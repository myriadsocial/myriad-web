import React, {useState, useCallback, useEffect} from 'react';
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';

import {CircularProgress} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import ShowIf from '../common/show-if.component';
import {useStyles} from './Login.styles';
import {Accounts} from './render/Accounts';
import {Login as LoginComponent} from './render/Login';
import {Options} from './render/Options';
import {Profile} from './render/Profile';

import {last} from 'lodash';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {useProfileHook} from 'src/hooks/use-profile.hook';
import {WalletTypeEnum, NetworkTypeEnum} from 'src/lib/api/ext-auth';

type LoginProps = {
  redirectAuth: WalletTypeEnum | null;
};

export const Login: React.FC<LoginProps> = props => {
  const {redirectAuth} = props;

  const styles = useStyles();

  const {anonymous, fetchUserNonce, fetchNearUserNonce, signInWithExternalAuth} = useAuthHook();
  const {checkUsernameAvailable} = useProfileHook();
  const {connectToNear} = useNearApi();

  const [walletType, setWalletType] = useState<WalletTypeEnum | null>(redirectAuth);
  const [networkType, setNetworkType] = useState<NetworkTypeEnum | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [nearWallet, setNearWallet] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [signatureCancelled, setSignatureCancelled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(Boolean(redirectAuth));
  const [initialEntries, setInitialEntries] = useState<string[]>(
    redirectAuth ? ['/wallet'] : ['/'],
  );

  useEffect(() => {
    if (redirectAuth === WalletTypeEnum.NEAR) {
      checkWalletRegistered();
    }
  }, [redirectAuth]);

  const checkWalletRegistered = useCallback(async () => {
    const data = await connectToNear();

    if (!data) return;

    setNearWallet(data.publicAddress);

    checkAccountRegistered(
      () => {
        setInitialEntries(['/profile']);
        setWalletLoading(false);
      },
      undefined,
      data.publicAddress,
    );
  }, []);

  const handleOnconnect = (accounts: InjectedAccountWithMeta[], networkType: NetworkTypeEnum) => {
    setNetworkType(networkType);
    setAccounts(accounts);
    setWalletType(WalletTypeEnum.POLKADOT);
  };

  const handleOnConnectNear = (
    nearId: string,
    callback: () => void,
    networkType: NetworkTypeEnum,
  ) => {
    setNetworkType(networkType);
    setNearWallet(nearId);
    setWalletType(WalletTypeEnum.NEAR);

    checkAccountRegistered(callback, undefined, nearId);
  };

  const handleSelectedAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
  };

  const switchAccount = async (account: InjectedAccountWithMeta, callback: () => void) => {
    handleSelectedAccount(account);

    checkAccountRegistered(callback, account);
  };

  const checkAccountRegistered = useCallback(
    async (callback: () => void, account?: InjectedAccountWithMeta, nearId?: string) => {
      switch (walletType) {
        case WalletTypeEnum.POLKADOT:
          {
            const currentAccount = account ?? selectedAccount;

            if (currentAccount) {
              setLoading(true);
              setSignatureCancelled(false);

              const {nonce} = await fetchUserNonce(currentAccount);

              if (nonce > 0) {
                const success = await signInWithExternalAuth(
                  networkType as NetworkTypeEnum,
                  nonce,
                  currentAccount,
                );

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
            const address = last(nearId.split('/'));

            if (!address) {
              setLoading(false);
              callback();

              return;
            }

            const {nonce} = await fetchNearUserNonce(address);

            if (nonce > 0) {
              setWalletLoading(false);
              const success = await signInWithExternalAuth(
                networkType as NetworkTypeEnum,
                nonce,
                undefined,
                nearId,
              );

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
    [selectedAccount, walletType],
  );

  if (walletLoading) return null;

  return (
    <div className={styles.root}>
      <Router initialEntries={initialEntries} initialIndex={0}>
        <Routes>
          <Route
            index={false}
            path="/"
            element={<LoginComponent anonymousLogin={anonymous} switchAccount={switchAccount} />}
          />

          <Route
            index={false}
            path="/wallet"
            element={<Options onConnect={handleOnconnect} onConnectNear={handleOnConnectNear} />}
          />

          <Route
            index={false}
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
            index={false}
            path="/profile"
            element={
              <Profile
                networkType={networkType}
                walletType={walletType}
                publicAddress={nearWallet}
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
