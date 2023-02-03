import React, {useCallback, useEffect, useState} from 'react';

import {useRouter} from 'next/router';

import {Backdrop, CircularProgress} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';
import {useStyles} from './Menu.styles';
import {useMenuList, MenuDetail, MenuId} from './use-menu-list';

import SelectServer from 'components/SelectServer';
import Cookies from 'js-cookie';
import {last} from 'lodash';
import {convertToPolkadotAddress} from 'src/helpers/extension';
import {useAuthLinkHook} from 'src/hooks/auth-link.hook';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {useUserHook} from 'src/hooks/use-user.hook';
import {ServerListProps} from 'src/interfaces/server-list';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import {getCheckEmail} from 'src/lib/api/user';
import i18n from 'src/locale';

type MenuProps = {
  selected: MenuId;
  onChange: (path: string) => void;
  logo: string;
  anonymous?: boolean;
};

export const Menu: React.FC<MenuProps> = props => {
  const {selected, onChange, logo, anonymous} = props;

  const styles = useStyles();
  const router = useRouter();
  const {redirect} = router.query;
  const {fetchUserNonce, signInWithExternalAuth, getRegisteredAccounts, clearNearCache, logout} =
    useAuthHook({redirect});
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {userWalletAddress, currentWallet, user} = useUserHook();
  const {requestLink} = useAuthLinkHook();
  const {connectToNear} = useNearApi();

  const menu = useMenuList(selected);

  const [serverSelected, setServerSelected] = useState<null | ServerListProps>(null);
  const [signatureCancelled, setSignatureCancelled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setWalletLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState();
  const [register, setRegister] = useState(false);

  const gotoHome = () => {
    if (router.pathname === '/') return;
    router.push('/', undefined, {shallow: true});
  };

  const openMenu = (item: MenuDetail) => () => {
    if (router.pathname === item.url) return;
    onChange(item.url);
  };

  const fetchAccounts = async () => {
    await enablePolkadotExtension();
    const accs = await getRegisteredAccounts();
    setAccounts(accs);
  };

  const getWallet = () => {
    const currentAddress = convertToPolkadotAddress(userWalletAddress, currentWallet);
    console.log({currentAddress});

    setAccount(accounts.find(item => item.address === currentAddress));
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
            const currentAccount = currentWallet;

            if (currentAccount) {
              setLoading(true);
              setSignatureCancelled(false);
              const {nonce} = await fetchUserNonce(currentAccount.id);

              if (nonce > 0) {
                const success = await signInWithExternalAuth(
                  currentWallet.networkId,
                  nonce,
                  account,
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
                currentWallet.networkId,
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
    [serverSelected],
  );

  const checkEmailRegistered = useCallback(
    async (successCallback: () => void, failedCallback: () => void, email: string) => {
      setLoading(true);
      const isEmailRegistered = await getCheckEmail(email);
      localStorage.setItem('email', email);
      setLoading(false);

      if (isEmailRegistered) {
        successCallback();
      } else {
        failedCallback();
      }
    },
    [],
  );

  const checkWalletRegistered = useCallback(async (wallet: WalletTypeEnum) => {
    const data = await connectToNear(undefined, undefined, wallet, 'login near');

    if (!data) return;

    checkAccountRegistered(
      () => {
        setWalletLoading(false);
      },
      undefined,
      data.publicAddress,
      wallet,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelected = (server: ServerListProps) => {
    setServerSelected(server);
  };

  useEffect(() => {
    if (serverSelected) {
      if (serverSelected.apiUrl !== Cookies.get('instance')) {
        if (anonymous) {
          setLoading(true);
          router.push({query: {rpc: `${serverSelected.apiUrl}`}}, undefined, {
            shallow: true,
          });
          Cookies.set('instance', serverSelected.apiUrl);
          router.reload();
        } else {
          if (user.wallets.length > 0) {
            Cookies.set('currentInstance', Cookies.get('instance'));
            Cookies.set('instance', serverSelected.apiUrl);
            checkAccountRegistered(
              () => {
                // setWalletLoading(false);
                setRegister(true);
              },
              account,
              undefined,
              WalletTypeEnum.POLKADOT,
            );
          } else {
            checkEmailRegistered(
              () => {
                Cookies.set('instance', serverSelected.apiUrl);
                requestLink(user.email);
                setTimeout(() => {
                  logout(`/login?switchInstance=true&email=${user.email}`);
                }, 1000);
              },
              () => {
                // setWalletLoading(false);
                setRegister(true);
              },
              user.email,
            );
          }
        }
      }
    }
  }, [serverSelected, Cookies.get('instance')]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accounts.length) {
      getWallet();
    }
  }, [accounts]);

  useEffect(() => {
    if (signatureCancelled) {
      if (Cookies.get('currentInstance')) {
        Cookies.set('instance', Cookies.get('currentInstance'));
        Cookies.remove('currentInstance');
      }
      setSignatureCancelled(false);
      setLoading(false);
    }
  }, [signatureCancelled]);

  useEffect(() => {
    if (redirect === WalletTypeEnum.NEAR || redirect === WalletTypeEnum.MYNEAR) {
      checkWalletRegistered(redirect);
    } else {
      clearNearCache();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect]);

  return (
    <div className={styles.root} data-testid={'menu-test'}>
      <BoxComponent paddingLeft={0} paddingRight={0}>
        <div className={styles.head} onClick={gotoHome} aria-hidden="true">
          <img src={logo} width={220} height={48} />
        </div>

        <div className={styles.instance}>
          <SelectServer
            title={i18n.t('Login.Options.Prompt_Select_Instance.Switch')}
            onServerSelect={server => toggleSelected(server)}
            register={register}
            setRegister={value => setRegister(value)}
          />
        </div>

        {menu
          .filter(ar => ar.isDesktop === true)
          .map(item => (
            <ListItemComponent
              data-testid={`list-item-${item.id}`}
              id={item.id}
              key={item.id}
              title={item.title}
              icon={item.icon}
              active={item.active}
              onClick={openMenu(item)}
              url={item.url}
              isAnimated={item.isAnimated}
            />
          ))}
      </BoxComponent>
      <Backdrop className={styles.backdrop} open={loading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
};
