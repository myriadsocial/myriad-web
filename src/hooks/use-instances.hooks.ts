import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';

import {signIn, useSession} from 'next-auth/react';
import {useRouter} from 'next/router';

import {numberToHex} from '@polkadot/util/number';
import {u8aToHex} from '@polkadot/util/u8a';

import {useAuthLinkHook} from './auth-link.hook';
import {useAuthHook} from './auth.hook';
import {usePolkadotExtension} from './use-polkadot-app.hook';
import {useUserHook} from './use-user.hook';

import useMyriadInstance from 'components/common/Blockchain/use-myriad-instance.hooks';
import * as nearAPI from 'near-api-js';
import {MYRIAD_WALLET_KEY} from 'src/interfaces/blockchain-interface';
import {ServerListProps} from 'src/interfaces/server-list';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
import * as NetworkAPI from 'src/lib/api/network';
import {getCheckEmail} from 'src/lib/api/user';
import {toHexPublicKey} from 'src/lib/crypto';
import {Near} from 'src/lib/services/near-api-js';
import {PolkadotJs} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {ServerState} from 'src/reducers/server/reducer';

export const useInstances = () => {
  const router = useRouter();

  const {data: session} = useSession();
  const {provider} = useMyriadInstance();
  const {fetchUserNonce, getRegisteredAccounts, logout} = useAuthHook();
  const {requestLink} = useAuthLinkHook();
  const {anonymous, currentWallet} = useUserHook();
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {server: currentServer, apiURL: currentApiURL} = useSelector<RootState, ServerState>(
    state => state.serverState,
  );

  const [serverList, setServerList] = useState<ServerListProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSwitch, setLoadingSwitch] = useState<boolean>(false);

  const getAllInstances = useCallback(async () => {
    try {
      if (!provider) return;

      const result = await provider.serverList();

      const servers = await Promise.all(
        result.map(async server => {
          let data = null;
          let apiURL = server.apiUrl;

          if (server.apiUrl === currentApiURL) {
            apiURL = currentApiURL;
            data = currentServer;
          } else {
            if (apiURL[apiURL.length - 1] === '/') {
              apiURL = apiURL.substring(0, apiURL.length - 1);
            }

            try {
              const response = await fetch(`${server.apiUrl}/server`);
              data = await response.json();
            } catch {
              // ignore
            }
          }

          return {
            ...server,
            apiUrl: apiURL,
            detail: data,
          };
        }),
      );

      setServerList(servers);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [provider]);

  const switchInstance = async (server: ServerListProps) => {
    if (server.apiUrl === currentApiURL) return;

    if (anonymous) return router.reload();

    const email = session?.user?.email;
    if (email) return loginWithEmail(server.apiUrl, email);

    const {nonce} = await fetchUserNonce(currentWallet.id, server.apiUrl);
    const network = await NetworkAPI.getNetwork(currentWallet.networkId, server.apiUrl);

    if (!network) throw new Error('NetworkNotExist');
    if (nonce <= 0) throw new Error('AccountNotFound');

    let walletType = window.localStorage.getItem(MYRIAD_WALLET_KEY);

    switch (currentWallet.blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE: {
        walletType = walletType ?? WalletTypeEnum.POLKADOT;

        const installed = await enablePolkadotExtension();

        if (!installed) throw new Error('ExtensionNotInstalled');

        const accounts = await getRegisteredAccounts();
        const account = accounts.find(e => toHexPublicKey(e) === currentWallet.id);

        if (!account) throw new Error('SubstrateAccountNotFound');

        const signature = await PolkadotJs.signWithWallet(account, nonce, ({signerOpened}) => {
          if (signerOpened) setLoadingSwitch(true);
        });

        if (!signature) throw new Error('FailedSignature');

        const result = await signIn('credentials', {
          name: account.meta.name,
          address: toHexPublicKey(account),
          publicAddress: toHexPublicKey(account),
          signature,
          walletType,
          networkId: network.id,
          nonce,
          anonymous: false,
          instanceURL: server.apiUrl,
          redirect: false,
        });

        if (!result.ok) throw new Error('FailedSwitchInstance');
        break;
      }

      // TODO: switch instance with NEAR when wallet not sign in
      case BlockchainPlatform.NEAR: {
        walletType = walletType ?? WalletTypeEnum.MYNEAR;

        const near = await Near.connect(network, walletType as WalletTypeEnum);
        const wallet = near?.provider?.wallet;

        if (!wallet.isSignedIn) throw new Error('NearAccountNotSignIn');

        const address = wallet.getAccountId();
        const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
        const keyPair = await keyStore.getKey(wallet._networkId, address);
        const userSignature = keyPair.sign(Buffer.from(numberToHex(nonce)));
        const publicAddress = u8aToHex(userSignature.publicKey.data);
        const signature = u8aToHex(userSignature.signature);

        const result = await signIn('credentials', {
          address,
          publicAddress,
          signature,
          walletType,
          networkId: network.id,
          nonce,
          anonymous: false,
          instanceURL: server.apiUrl,
          redirect: false,
        });

        if (!result.ok) throw new Error('FailedSwitchInstance');
        break;
      }

      default:
        throw new Error('BlockchainPlatformNotFound');
    }

    window.localStorage.setItem(MYRIAD_WALLET_KEY, walletType);
    router.reload();
    setLoadingSwitch(false);
  };

  const loginWithEmail = async (apiURL: string, email: string) => {
    const registered = await getCheckEmail(email, apiURL);
    if (!registered) throw new Error('AccountNotFound');

    await requestLink(email, apiURL);
    setTimeout(() => {
      logout(`/login?switchInstance=true&email=${email}`, apiURL);
    }, 1000);
  };

  return {
    instance: currentServer,
    switchInstance,
    loadingSwitch,
    onLoadingSwitch: setLoadingSwitch,
    apiURL: currentApiURL,
    getAllInstances,
    servers: serverList,
    loading,
  };
};
