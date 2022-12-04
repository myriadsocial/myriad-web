import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import useConfirm from '../Confirm/use-confirm.hook';
import {useEnqueueSnackbar} from '../Snackbar/useEnqueueSnackbar.hook';
import BlockchainContext from './Blockchain.context';

import {formatNetworkTitle, formatWalletTitle} from 'src/helpers/wallet';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useConnect} from 'src/hooks/use-connect.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {IProvider} from 'src/interfaces/blockchain-interface';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {UserWallet, Wallet, WalletWithSigner} from 'src/interfaces/user';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import {Server} from 'src/lib/api/server';
import {toHexPublicKey} from 'src/lib/crypto';
import {RootState} from 'src/reducers';
import {clearBalances} from 'src/reducers/balance/actions';
import {UserState} from 'src/reducers/user/reducer';

const PolkadotAccountList = dynamic(
  () => import('components/PolkadotAccountList/PolkadotAccountList'),
  {
    ssr: false,
  },
);

const NearSelectorList = dynamic(() => import('components/NearSelector/NearSelectorList'), {
  ssr: false,
});

interface BlockchainProviderProps {
  server: Server;
  provider: IProvider;
  currentWallet: UserWallet;
  loadingBlockchain: boolean;
  onChangeProvider: () => void;
}

export const BlockchainProvider: React.ComponentType<BlockchainProviderProps> = ({
  children,
  server,
  provider,
  currentWallet,
  onChangeProvider,
  loadingBlockchain,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {wallets, networks} = useSelector<RootState, UserState>(state => state.userState);
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const {switchNetwork, loading: loadingSwitch} = useConnect();

  const enqueueSnackbar = useEnqueueSnackbar();
  const confirm = useConfirm();

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [showWalletList, setShowWalletList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  const [network, setNetwork] = React.useState<Network | null>(null);
  const [wallet, setWallet] = React.useState<WalletWithSigner | null>(null);

  const action = router.query.action as string | string[] | null;
  const walletType = router.query.walletType as string | string[] | null;

  const currentNetworkId = currentWallet?.network?.id;

  useEffect(() => {
    if (
      !Array.isArray(action) &&
      !Array.isArray(walletType) &&
      action === 'switch' &&
      (walletType === WalletTypeEnum.NEAR || walletType === WalletTypeEnum.MYNEAR)
    ) {
      const network = networks.find(network => network.id === NetworkIdEnum.NEAR);

      if (network) {
        const wallet: Partial<Wallet> = {
          id: '',
          blockchainPlatform: BlockchainPlatform.NEAR,
          type: walletType as WalletTypeEnum,
        };

        handleSwitchNetwork(wallet as Wallet, network);
      }
    }
  }, [action, walletType]);

  const handleOpenPrompt = (select: NetworkIdEnum) => {
    showConfirmDialog(select);
  };

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const closeWalletList = () => {
    setShowWalletList(false);
  };

  const handleSwitchNetwork = async (
    wallet: WalletWithSigner,
    network: Network,
    callback?: (error: boolean) => void,
  ) => {
    let error = true;

    try {
      await switchNetwork(wallet, network, () => {
        dispatch(clearBalances());
        onChangeProvider();
        setNetwork(null);
        setWallet(null);
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

    const wallet = wallets?.find(wallet => wallet?.blockchainPlatform === blockchainPlatform);

    switch (wallet?.blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE:
        wallet.type = WalletTypeEnum.POLKADOT;
        return checkExtensionInstalled(network, wallet);
      case BlockchainPlatform.NEAR:
        return checkWalletList(network, wallet);
      default:
        handleOpenPrompt(networkId);
    }
  };

  // POLKADOT
  const checkExtensionInstalled = async (network: Network, wallet: WalletWithSigner) => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);
    setNetwork(network);
    setWallet(wallet);

    getAvailableAccounts();
  };

  const checkWalletList = async (network: Network, wallet: WalletWithSigner) => {
    setShowWalletList(true);
    setNetwork(network);
    setWallet(wallet);
  };

  const getAvailableAccounts = async () => {
    const wallet = wallets?.find(
      wallet => wallet?.blockchainPlatform === BlockchainPlatform.SUBSTRATE,
    );

    const accounts = await getRegisteredAccounts();
    const account = accounts.filter(e => toHexPublicKey(e) === wallet?.id);

    setAccounts(account);
  };

  const handleSelectedNearWallet = (walletType: WalletTypeEnum) => {
    closeWalletList();
    if (!network || !wallet) return;
    wallet.type = walletType;
    handleSwitchNetwork(wallet, network);
  };

  const handleSelectedSubstrateAccount = (account: InjectedAccountWithMeta) => {
    closeAccountList();
    if (!network || !wallet) return;
    wallet.signer = account;
    handleSwitchNetwork(wallet, network);
  };

  const handleConnectWallet = () => {
    router.push({pathname: '/wallet', query: {type: 'manage'}});
  };

  const showConfirmDialog = (selected: NetworkIdEnum) => {
    confirm({
      title: `You didn’t connect your ${formatNetworkTitle(selected)}!`,
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
        value={{
          server,
          provider,
          switchNetwork: shiftNetwork,
          switchInstance: onChangeProvider,
          loadingBlockchain,
          loadingSwitch,
        }}>
        {children}
      </BlockchainContext.Provider>
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleSelectedSubstrateAccount}
        onClose={closeAccountList}
      />
      <NearSelectorList
        align="left"
        title="Select Near Wallet"
        isOpen={showWalletList}
        onSelect={handleSelectedNearWallet}
        onClose={closeWalletList}
      />
    </>
  );
};

export default BlockchainProvider;
