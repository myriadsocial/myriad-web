import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {NoSsr} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import useConfirm from '../Confirm/use-confirm.hook';
import {useEnqueueSnackbar} from '../Snackbar/useEnqueueSnackbar.hook';
import BlockchainContext from './Blockchain.context';

import {PolkadotAccountList} from 'components/PolkadotAccountList';
import {formatNetworkTitle, formatWalletTitle} from 'src/helpers/wallet';
import {NearPayload, useAuthHook} from 'src/hooks/auth.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {IProvider} from 'src/interfaces/blockchain-interface';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';
import {BlockchainPlatform} from 'src/interfaces/wallet';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import {toHexPublicKey} from 'src/lib/crypto';
import {BlockchainProvider as Provider} from 'src/lib/services/blockchain-provider';
import {Near} from 'src/lib/services/near-api-js';
import {RootState} from 'src/reducers';
import {clearBalances} from 'src/reducers/balance/actions';
import {UserState} from 'src/reducers/user/reducer';

interface BlockchainProviderProps {
  provider: IProvider;
  currentWallet: UserWallet;
  loadingBlockchain: boolean;
  onChangeProvider: () => void;
}

export const BlockchainProvider: React.ComponentType<BlockchainProviderProps> = ({
  children,
  provider,
  currentWallet,
  onChangeProvider,
  loadingBlockchain,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {wallets, networks} = useSelector<RootState, UserState>(state => state.userState);
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {switchNetwork, getRegisteredAccounts, loading: loadingSwitch} = useAuthHook();
  const {publicRuntimeConfig} = getConfig();

  const enqueueSnackbar = useEnqueueSnackbar();
  const confirm = useConfirm();

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  const [networkId, setNetworkId] = React.useState<NetworkIdEnum | null>(null);

  const accountId = router.query.account_id as string | null;
  const action = router.query.action as string | string[] | null;

  const currentNetworkId = currentWallet?.networkId;

  useEffect(() => {
    if (!Array.isArray(action) && action === 'switch' && accountId) {
      const network = networks.find(network => network.id === NetworkIdEnum.NEAR);
      if (network) shiftNetwork(network);
    }
  }, [accountId, action]);

  const handleOpenPrompt = (select: NetworkIdEnum) => {
    showConfirmDialog(select);
  };

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const handleSwitchNetwork = async (
    blockchainPlatform: BlockchainPlatform,
    networkId: NetworkIdEnum,
    account: InjectedAccountWithMeta | NearPayload,
    callback?: (error: boolean) => void,
  ) => {
    let error = true;

    try {
      await switchNetwork(blockchainPlatform, networkId, account, () => {
        dispatch(clearBalances());
        onChangeProvider();
        setNetworkId(null);
        error = false;
      });
    } catch (err) {
      if (err instanceof AccountRegisteredError) {
        enqueueSnackbar({
          message: 'Failed! ' + err.message,
          variant: 'error',
        });
      }
    } finally {
      callback && callback(error);
    }
  };

  const shiftNetwork = async (network: Network) => {
    const {id: networkId, blockchainPlatform} = network;

    if (networkId === currentNetworkId) return;

    const wallet = wallets?.find(
      wallet => wallet?.network?.blockchainPlatform === blockchainPlatform,
    );

    switch (wallet?.network?.blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE:
        return checkExtensionInstalled(networkId);
      case BlockchainPlatform.NEAR: {
        const callbackUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);
        const redirectUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);
        // clear previous query param
        redirectUrl.hash = '';
        redirectUrl.search = '';
        callbackUrl.hash = '';
        callbackUrl.search = '';

        callbackUrl.searchParams.set('action', 'switch');
        callbackUrl.searchParams.set('loading', 'true');

        if (router.query?.q && !Array.isArray(router.query?.q)) {
          callbackUrl.searchParams.set('q', router.query.q);
          redirectUrl.searchParams.set('q', router.query.q);
        }

        const blockchain = await Provider.connect(network);
        const near = blockchain.Near;
        const data = await Near.signWithWallet(
          near?.provider?.wallet,
          undefined,
          callbackUrl.toString(),
        );

        if (data) {
          const payload: NearPayload = {
            publicAddress: data.publicAddress,
            nearAddress: data.publicAddress.split('/')[1],
            pubKey: data.publicAddress.split('/')[0],
            signature: data.signature,
          };

          await handleSwitchNetwork(BlockchainPlatform.NEAR, networkId, payload, async err => {
            if (err) await near.disconnect();
          });

          router.replace(redirectUrl, undefined, {shallow: true});
        } else {
          console.log('redirection to near auth page');
        }

        break;
      }

      default:
        handleOpenPrompt(networkId);
    }
  };

  // POLKADOT
  const checkExtensionInstalled = async (networkId: NetworkIdEnum) => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts(networkId);
  };

  const getAvailableAccounts = async (networkId: NetworkIdEnum) => {
    const wallet = wallets?.find(
      wallet => wallet?.network?.blockchainPlatform === BlockchainPlatform.SUBSTRATE,
    );

    const accounts = await getRegisteredAccounts();
    const account = accounts.filter(e => toHexPublicKey(e) === wallet?.id);

    setAccounts(account);
    setNetworkId(networkId);
  };

  const handleSelectedSubstrateAccount = (account: InjectedAccountWithMeta) => {
    closeAccountList();
    if (!networkId) return;
    handleSwitchNetwork(BlockchainPlatform.SUBSTRATE, networkId, account);
  };

  const handleConnectWallet = () => {
    router.push(`/wallet?type=manage`);
  };

  const showConfirmDialog = (selected: NetworkIdEnum) => {
    confirm({
      title: `You didn’t connect your ${formatNetworkTitle(undefined, selected)}!`,
      description: `This account is not connected with ${formatWalletTitle(
        undefined,
        selected,
      )}. Please connect to ${formatWalletTitle(
        undefined,
        selected,
      )} in wallet manage tab. Do you want to connect your account?`,
      icon: 'warning',
      confirmationText: 'Yes',
      cancellationText: 'Cancel',
      onConfirm: () => {
        handleConnectWallet();
      },
    });
  };

  return (
    <>
      <BlockchainContext.Provider
        value={{provider, switchNetwork: shiftNetwork, loadingBlockchain, loadingSwitch}}>
        {children}
      </BlockchainContext.Provider>
      <NoSsr>
        <PolkadotAccountList
          align="left"
          title="Select account"
          isOpen={showAccountList && extensionInstalled}
          accounts={accounts}
          onSelect={handleSelectedSubstrateAccount}
          onClose={closeAccountList}
        />
      </NoSsr>
    </>
  );
};
