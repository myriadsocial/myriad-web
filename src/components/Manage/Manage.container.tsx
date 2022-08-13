import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {useTheme, useMediaQuery} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {BoxComponent} from '../atoms/Box';
import {Manage} from './Manage';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useConnect} from 'src/hooks/use-connect.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {BlockchainPlatform} from 'src/interfaces/wallet';
import {Near} from 'src/lib/services/near-api-js';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const PolkadotAccountList = dynamic(
  () => import('components/PolkadotAccountList/PolkadotAccountList'),
  {
    ssr: false,
  },
);

export const ManageCointainer: React.FC = () => {
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const {connectToNear} = useNearApi();
  const {connectNetwork} = useConnect();
  const {publicRuntimeConfig} = getConfig();

  const {user, currentWallet, wallets} = useSelector<RootState, UserState>(
    state => state.userState,
  );

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);

  const action = router.query.action as string | string[] | null;
  const accountId = router.query.account_id as string | string[] | null;

  useEffect(() => {
    if (!Array.isArray(action) && action === 'connect' && accountId) {
      connectNearAccount();
    }
  }, [action, accountId]);

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
    closeAccountList();

    let verified = false;

    try {
      verified = await (account
        ? connectNetwork(BlockchainPlatform.SUBSTRATE, account)
        : connectNearAccount());
    } catch {
      //
    }

    verified &&
      account &&
      enqueueSnackbar({
        message: i18n.t('Wallet.Manage.Alert.Connect'),
        variant: 'success',
      });

    !verified &&
      account &&
      enqueueSnackbar({
        message: i18n.t('Wallet.Manage.Alert.Error'),
        variant: 'error',
      });
  };

  const connectNearAccount = async (): Promise<boolean> => {
    let verified = false;

    const callbackUrl =
      publicRuntimeConfig.appAuthURL + router.route + '?type=manage&action=connect';

    try {
      if (!user) return false;

      const signatureData = await connectToNear(callbackUrl, callbackUrl);

      if (!signatureData) return false;

      const payload = {
        publicAddress: signatureData.publicAddress,
        nearAddress: signatureData.publicAddress.split('/')[1],
        pubKey: signatureData.publicAddress.split('/')[0],
        signature: signatureData.signature,
        nonce: signatureData.nonce,
      };

      verified = await connectNetwork(BlockchainPlatform.NEAR, payload, async error => {
        if (error) await Near.clearLocalStorage();
      });
    } catch {
      //
    } finally {
      router.replace(router.route, undefined, {shallow: true});
    }

    return verified;
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
    <BoxComponent
      isWithChevronRightIcon={false}
      marginTop={'20px'}
      paddingLeft={isMobile ? 0 : 1}
      paddingRight={isMobile ? 0 : theme.spacing(3.75)}>
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
