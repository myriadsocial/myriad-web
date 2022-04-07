import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {PolkadotAccountList} from '../PolkadotAccountList';
import {BoxComponent} from '../atoms/Box';
import {Manage} from './Manage';

import {useAuthHook} from 'src/hooks/auth.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import {getWalletDetail} from 'src/lib/services/near-api-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ManageCointainer: React.FC = () => {
  const {currentWallet, wallets} = useSelector<RootState, UserState>(state => state.userState);
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const {connectNetwork} = useAuthHook();
  const {connectToNear} = useNearApi();
  const router = useRouter();
  const {publicRuntimeConfig} = getConfig();
  const {openToasterSnack} = useToasterSnackHook();

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);

  useEffect(() => {
    const query = router.query;

    if (query.connect) {
      connectNearAccount();
    }
  }, [router.query]);

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts();
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();

    setAccounts(accounts);
  };

  const handleConnect = async (account?: InjectedAccountWithMeta) => {
    try {
      if (account) {
        await connectNetwork(account);
      } else {
        const callbackUrl =
          publicRuntimeConfig.appAuthURL + router.route + '?type=manage&connect=true';

        const {publicAddress, signature} = await connectToNear(callbackUrl);
        const payload = {
          publicAddress,
          nearAddress: publicAddress.split('/')[1],
          pubKey: publicAddress.split('/')[0],
          signature,
        };

        await connectNetwork(undefined, payload);
      }
    } catch (error) {
      if (error instanceof AccountRegisteredError) {
        openToasterSnack({
          message: error.message,
          variant: 'error',
        });
      }
    }
  };

  const connectNearAccount = async (): Promise<void> => {
    try {
      const {address, publicKey, signature} = await getWalletDetail();
      const payload = {
        publicAddress: publicKey + '/' + address,
        nearAddress: address,
        pubKey: publicKey,
        signature,
      };
      await connectNetwork(undefined, payload);
    } catch (error) {
      if (error instanceof AccountRegisteredError) {
        openToasterSnack({
          message: error.message,
          variant: 'error',
        });
      }
    } finally {
      router.replace(router.route, undefined, {shallow: true});
    }
  };

  const onConnect = (type: string) => {
    switch (type) {
      case 'polkadot':
        checkExtensionInstalled();
        break;
      case 'near':
        handleConnect();
        break;
      default:
        break;
    }
  };

  return (
    <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
      <Manage currentWallet={currentWallet} wallets={wallets} onConnect={onConnect} />
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleConnect}
        onClose={closeAccountList}
      />
    </BoxComponent>
  );
};

export default ManageCointainer;
