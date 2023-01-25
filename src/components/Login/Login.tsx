import React, {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';

import {signIn} from 'next-auth/react';
import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
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

import {MyriadFullIcon} from 'components/atoms/Icons';
import last from 'lodash/last';
import LoginMagicLink from 'src/components/Login/render/MagicLink/LoginMagicLink';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import useMobileDetect from 'src/hooks/use-is-mobile-detect';
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
  const detect = useMobileDetect();
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);

  const router = useRouter();
  const styles = useStyles();

  const {redirect} = router.query;

  const {fetchUserNonce, signInWithExternalAuth, clearNearCache} = useAuthHook({redirect});
  const {checkUsernameAvailable} = useProfileHook();
  const {connectToNear} = useNearApi();

  const {query} = useQueryParams();
  const {showAlert} = useAlertHook();

  const [, setToken] = useState('');
  const [walletType, setWalletType] = useState<WalletTypeEnum | null>(redirectAuth);
  const [networkId, setNetworkId] = useState<NetworkIdEnum | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [nearWallet, setNearWallet] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [signatureCancelled, setSignatureCancelled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(Boolean(redirectAuth));
  const [initialEntries, setInitialEntries] = useState<string[]>([
    query.network ? '/options' : '/',
  ]);
  const [email, setEmail] = useState<string>('');
  const [disableSignIn, setDisableSignIn] = useState<boolean>(false);

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

  const registeredEmail = localStorage.getItem('email');

  useEffect(() => {
    if (query.token && typeof query.token === 'string' && registeredEmail) {
      const {token} = query;

      setDisableSignIn(true);

      signIn('emailCredentials', {
        name: '',
        username: '',
        email: registeredEmail,
        token,
        redirect: false,
      }).then(response => {
        if (response.ok) {
          router.reload();
          router.push('/');
        }

        if (response.error) {
          showAlert({
            message: token ? i18n.t('Login.Alert.Invalid_OTP') : i18n.t('Login.Alert.Message'),
            severity: 'error',
            title: i18n.t('Login.Alert.Title'),
          });
          setDisableSignIn(false);
        }
      });

      setToken(token);
      localStorage.removeItem('email');
      router.replace({pathname: '/login', query: {}}, undefined, {shallow: true});
    }
  }, [query, registeredEmail]);

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
      localStorage.removeItem('email');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAccount, walletType],
  );

  const checkEmailRegistered = useCallback(
    async (successCallback: () => void, failedCallback: () => void, email: string) => {
      if (!email.length) throw new Error('Please input your email!');

      setEmail(email);

      localStorage.setItem('email', email);

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
      {detect.isMobile() && (
        <div className={styles.iconMobile}>
          <MyriadFullIcon />
          <Typography className={styles.iconTitle}>
            Social media with{' '}
            <span style={{color: '#6E3FC3', fontWeight: '600'}}>No Boundaries</span>
          </Typography>
        </div>
      )}
      <Router initialEntries={initialEntries} initialIndex={0}>
        <Routes>
          <Route index={false} path="/" element={<SigninMethod disableSignIn={disableSignIn} />} />

          <Route index={false} path="/magiclink" element={<LoginMagicLink email={email} />} />

          <Route
            index={false}
            path="/email"
            element={<LoginByEmail onNext={checkEmailRegistered} />}
          />

          <Route
            index={false}
            path="/createAccounts"
            element={
              <CreateAccounts email={email} checkUsernameAvailability={checkUsernameAvailable} />
            }
          />

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
