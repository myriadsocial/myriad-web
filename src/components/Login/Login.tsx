import React, {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';

import {signIn} from 'next-auth/react';

import {CircularProgress} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import ShowIf from '../common/show-if.component';
import {useStyles} from './Login.styles';
import {Accounts} from './render/Accounts';
import CreateAccounts from './render/CreateAccounts/CreateAccounts';
import LoginByEmail from './render/Email/LoginByEmail';
import {Options} from './render/Options';
import {Profile} from './render/Profile';
import SigninMethod from './render/SignInMethod/SigninMethod';

import last from 'lodash/last';
import LoginMagicLink from 'src/components/Login/render/MagicLink/LoginMagicLink';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {useProfileHook} from 'src/hooks/use-profile.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import {getCheckEmail} from 'src/lib/api/user';
import {toHexPublicKey} from 'src/lib/crypto';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

type LoginProps = {
  redirectAuth: WalletTypeEnum | null;
  isMobileSignIn?: boolean;
};

export const Login: React.FC<LoginProps> = props => {
  const {redirectAuth, isMobileSignIn} = props;
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);

  const styles = useStyles();

  const {fetchUserNonce, signInWithExternalAuth, clearNearCache} = useAuthHook();
  const {checkUsernameAvailable} = useProfileHook();
  const {connectToNear} = useNearApi();

  const {query} = useQueryParams();

  const [, setToken] = useState('');
  const [walletType, setWalletType] = useState<WalletTypeEnum | null>(redirectAuth);
  const [networkId, setNetworkId] = useState<NetworkIdEnum | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [nearWallet, setNearWallet] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [signatureCancelled, setSignatureCancelled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(Boolean(redirectAuth));
  const [initialEntries, setInitialEntries] = useState<string[]>(['/']);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (redirectAuth === WalletTypeEnum.NEAR || redirectAuth === WalletTypeEnum.MYNEAR) {
      checkWalletRegistered(redirectAuth);
    } else {
      clearNearCache();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectAuth]);

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);

  useEffect(() => {
    if (query.token && typeof query.token === 'string') {
      const {token} = query;

      signIn('emailCredentials', {
        name: '',
        username: '',
        email,
        token,
      });

      setToken(token);
    }
  }, [query, email]);

  const checkWalletRegistered = useCallback(async (wallet: WalletTypeEnum) => {
    const data = await connectToNear(undefined, undefined, wallet, 'login near');

    if (!data) return;

    setNearWallet(data.publicAddress);

    checkAccountRegistered(
      () => {
        setInitialEntries(['/profile']);
        setNetworkId(NetworkIdEnum.NEAR);
        setWalletLoading(false);
      },
      undefined,
      data.publicAddress,
      wallet,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnconnect = (accounts: InjectedAccountWithMeta[], networkId: NetworkIdEnum) => {
    setNetworkId(networkId);
    setAccounts(accounts);
    setWalletType(WalletTypeEnum.POLKADOT);
  };

  const handleOnConnectNear = (
    nearId: string,
    callback: () => void,
    networkId: NetworkIdEnum,
    walletType: WalletTypeEnum,
  ) => {
    setNetworkId(networkId);
    setNearWallet(nearId);
    setWalletType(walletType);

    checkAccountRegistered(callback, undefined, nearId, walletType);
  };

  const handleSelectedAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
  };

  const checkAccountRegistered = useCallback(
    async (
      callback: () => void,
      account?: InjectedAccountWithMeta,
      nearId?: string,
      walletType?: WalletTypeEnum,
    ) => {
      switch (walletType) {
        case WalletTypeEnum.POLKADOT:
          {
            const currentAccount = account ?? selectedAccount;

            if (currentAccount) {
              setLoading(true);
              setSignatureCancelled(false);

              const address = toHexPublicKey(currentAccount);
              const {nonce} = await fetchUserNonce(address);

              if (nonce > 0) {
                const success = await signInWithExternalAuth(
                  networkId,
                  nonce,
                  currentAccount,
                  undefined,
                  walletType,
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

        case WalletTypeEnum.MYNEAR:
        case WalletTypeEnum.NEAR: {
          if (nearId) {
            const address = last(nearId.split('/'));

            if (!address) {
              setLoading(false);
              callback();

              return;
            }

            const {nonce} = await fetchUserNonce(address);

            if (nonce > 0) {
              setWalletLoading(false);
              const success = await signInWithExternalAuth(
                networkId,
                nonce,
                undefined,
                nearId,
                walletType,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAccount, walletType],
  );

  const checkEmailRegistered = useCallback(
    async (successCallback: () => void, failedCallback: () => void, email: string) => {
      if (!email.length) throw new Error('Please input your email!');

      setEmail(email);

      const isEmailRegistered = await getCheckEmail(email);

      if (isEmailRegistered) {
        successCallback();
      } else {
        failedCallback();
      }
    },
    [],
  );

  if (walletLoading) return null;

  return (
    <div className={styles.root}>
      <Router initialEntries={initialEntries} initialIndex={0}>
        <Routes>
          <Route index={false} path="/" element={<SigninMethod />} />

          <Route index={false} path="/magiclink" element={<LoginMagicLink email={email} />} />

          <Route
            index={false}
            path="/email"
            element={<LoginByEmail onNext={checkEmailRegistered} />}
          />

          <Route index={false} path="/createAccounts" element={<CreateAccounts email={email} />} />

          <Route
            index={false}
            path="/options"
            element={
              <Options
                onConnect={handleOnconnect}
                onConnectNear={handleOnConnectNear}
                isMobileSignIn={isMobileSignIn}
              />
            }
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
                networkId={networkId}
                walletType={walletType}
                publicAddress={nearWallet}
                account={selectedAccount}
                checkUsernameAvailability={checkUsernameAvailable}
                isMobileSignIn={isMobileSignIn}
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
