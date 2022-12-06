import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useSession} from 'next-auth/react';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {
  Button,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {toHexPublicKey} from '../../lib/crypto';
import {BoxComponent} from '../atoms/Box';
import {Manage} from './Manage';
import {useStyles} from './manage.style';
import {WalletOption} from './use-wallet-list.hook';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useConnect} from 'src/hooks/use-connect.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {NetworkIdEnum} from 'src/interfaces/network';
import {Wallet, WalletWithSigner} from 'src/interfaces/user';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
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

const NearSelectorList = dynamic(() => import('components/NearSelector/NearSelectorList'), {
  ssr: false,
});

export const ManageCointainer: React.FC = () => {
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const styles = useStyles();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const {loading, connectWallet, disconnectWallet} = useConnect();
  const {data: session} = useSession();

  const {wallets, networks} = useSelector<RootState, UserState>(state => state.userState);

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [showWalletList, setShowWalletList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  const [promptDisconnectSuccess, setPromptDisconnectSuccess] = React.useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = React.useState(false);
  const [wallet, setWallet] = React.useState<WalletWithSigner | null>(null);

  const action = router.query.action as string | string[] | null;
  const walletType = router.query.wallet as string | string[] | null;

  useEffect(() => {
    if (!action || !walletType) return;
    if (Array.isArray(action) || Array.isArray(walletType)) return;

    const wallet: Partial<Wallet> = {
      id: '',
      blockchainPlatform: BlockchainPlatform.NEAR,
      type: walletType as WalletTypeEnum,
    };

    if (action === 'connect') {
      handleConnectNearWallet(wallet as Wallet);
    }

    if (action === 'disconnect') {
      handleDisconnectNearWallet(wallet as Wallet);
    }
  }, [action]);

  // Near wallet selector modal
  const onShowNearWalletList = () => {
    setConfirmDisconnect(false);
    setShowWalletList(true);
  };

  const closeWalletList = () => {
    setShowWalletList(false);
    setConfirmDisconnect(false);
    setWallet(null);
  };

  // Polkadot Select Account Modal
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

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  // Polkadot wallet connection
  const handleConnectPolkadotWallet = async (account?: InjectedAccountWithMeta) => {
    if (!account || !wallet) return;
    const currentWallet = {...wallet, signer: account};
    const currentNetwork = networks.find(network => network.id === NetworkIdEnum.MYRIAD);
    await connectWallet(currentWallet, currentNetwork, error => {
      const variant = !error ? 'success' : 'error';
      const message = !error
        ? i18n.t('Wallet.Manage.Alert.Connect')
        : i18n.t('Wallet.Manage.Alert.ErrorConnect');

      setWallet(null);
      setShowAccountList(false);
      enqueueSnackbar({message, variant});
    });
  };

  const handleDisconnectPolkadotWallet = async (wallet: WalletWithSigner) => {
    await disconnectWallet(wallet, undefined, error => {
      if (!error) return setPromptDisconnectSuccess(true);
      const variant = 'error';
      const message = i18n.t('Wallet.Manage.Alert.ErrorDisconnect');

      enqueueSnackbar({message, variant});
    });
  };

  // Near wallet connection
  const handleSelectedNearWallet = async (walletType: WalletTypeEnum) => {
    if (!wallet) return;
    const currentWallet = {...wallet, type: walletType};
    if (!wallet?.id) return handleConnectNearWallet(currentWallet);
    return handleDisconnectNearWallet(currentWallet);
  };

  const handleConnectNearWallet = async (wallet: Wallet) => {
    const currentNetwork = networks.find(network => network.id === NetworkIdEnum.NEAR);
    if (!currentNetwork) return;
    await connectWallet(wallet, currentNetwork, async error => {
      if (error) await Near.clearLocalStorage();
      const variant = !error ? 'success' : 'error';
      const message = !error
        ? i18n.t('Wallet.Manage.Alert.Connect')
        : i18n.t('Wallet.Manage.Alert.ErrorConnect');

      setWallet(null);
      setShowWalletList(false);
      enqueueSnackbar({message, variant});
    });
  };

  const handleDisconnectNearWallet = async (wallet: Wallet) => {
    const currentNetwork = networks.find(network => network.id === NetworkIdEnum.NEAR);
    if (!currentNetwork) return;
    await disconnectWallet(wallet, currentNetwork, async error => {
      if (!error) return setPromptDisconnectSuccess(true);

      await Near.clearLocalStorage();

      const variant = 'error';
      const message = i18n.t('Wallet.Manage.Alert.ErrorDisconnect');

      enqueueSnackbar({message, variant});
    });
  };

  // Action
  const onConnectWallet = (option: WalletOption) => {
    const wallet: Partial<Wallet> = {
      id: option?.walletId,
      blockchainPlatform: option.blockchainPlatform,
      type: option.id,
    };

    setWallet(wallet as Wallet);

    switch (option.id) {
      case WalletTypeEnum.NEAR:
        return setShowWalletList(true);
      case WalletTypeEnum.POLKADOT:
        return checkExtensionInstalled();
      default:
        return;
    }
  };

  const onDisconnectWallet = (option: WalletOption) => {
    const wallet: Partial<Wallet> = {
      id: option?.walletId,
      blockchainPlatform: option.blockchainPlatform,
      type: option.id,
    };

    setWallet(wallet as Wallet);
    setConfirmDisconnect(true);
  };

  // Confirmation
  const onConfirmDisconnect = async () => {
    if (!wallet) return;
    if (session?.user?.walletType === wallet?.type) return;
    if (wallet?.type === WalletTypeEnum.NEAR) {
      return onShowNearWalletList();
    }

    await enablePolkadotExtension();

    const accounts = await getRegisteredAccounts();
    const currentAccount = accounts.find(account => toHexPublicKey(account) === wallet.id);

    if (!currentAccount) {
      setConfirmDisconnect(false);
      return enqueueSnackbar({
        message: i18n.t('Wallet.Manage.Alert.ErrorDisconnect'),
        variant: 'error',
      });
    }

    handleDisconnectPolkadotWallet({...wallet, signer: currentAccount});
  };

  return (
    <BoxComponent
      isWithChevronRightIcon={false}
      marginTop={'20px'}
      paddingLeft={isMobile ? 0 : 1}
      paddingRight={isMobile ? 0 : theme.spacing(3.75)}>
      <Manage wallets={wallets} onConnect={onConnectWallet} onDisconnect={onDisconnectWallet} />
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleConnectPolkadotWallet}
        onClose={closeAccountList}
      />
      <NearSelectorList
        align="left"
        title="Select Near Wallet"
        isOpen={showWalletList}
        onSelect={handleSelectedNearWallet}
        onClose={closeWalletList}
      />
      <PromptComponent
        icon="danger"
        open={confirmDisconnect}
        onCancel={() => setConfirmDisconnect(false)}
        title={i18n.t('Wallet.Manage.Alert.Disconnect.Confirm.Title')}
        subtitle={
          <Typography component="div">
            {wallet?.type === WalletTypeEnum.POLKADOT
              ? i18n.t('Wallet.Manage.Alert.Disconnect.Confirm.Subtitle_Polkadot', {
                  name: WalletTypeEnum.POLKADOT,
                })
              : i18n.t('Wallet.Manage.Alert.Disconnect.Confirm.Subtitle_Near', {
                  name: wallet?.type?.toUpperCase(),
                })}
          </Typography>
        }>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setConfirmDisconnect(false)}>
            {i18n.t('Wallet.Manage.Alert.Disconnect.Confirm.Btn_Cancel')}
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={onConfirmDisconnect}>
            {i18n.t('Wallet.Manage.Alert.Disconnect.Confirm.Btn_Confirm')}
          </Button>
        </div>
      </PromptComponent>

      <PromptComponent
        icon="success"
        open={promptDisconnectSuccess}
        onCancel={() => setPromptDisconnectSuccess(false)}
        title={i18n.t('Wallet.Manage.Alert.Disconnect.Success.Title')}
        subtitle={
          <Typography component="div">
            {i18n.t('Wallet.Manage.Alert.Disconnect.Success.Subtitle')}
          </Typography>
        }>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setPromptDisconnectSuccess(false);
            }}>
            {i18n.t('Wallet.Manage.Alert.Disconnect.Success.Btn_Dismiss')}
          </Button>
        </div>
      </PromptComponent>
      <Backdrop className={styles.backdrop} open={loading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </BoxComponent>
  );
};

export default ManageCointainer;
