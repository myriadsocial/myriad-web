import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
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

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useConnect} from 'src/hooks/use-connect.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
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
  const {connectToNear} = useNearApi();
  const {loading, connectDisconnectNetwork} = useConnect();
  const {publicRuntimeConfig} = getConfig();

  const {user, currentWallet, wallets} = useSelector<RootState, UserState>(
    state => state.userState,
  );

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [showWalletList, setShowWalletList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  const [walletId, setWalletId] = React.useState<string | null>(null);
  const [promptDisconnectSuccess, setPromptDisconnectSuccess] = React.useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = React.useState(false);
  const [walletName, setWalletName] = React.useState<string | null>(null);
  const [initNear, setInitNear] = React.useState<boolean>(false);

  const action = router.query.action as string | string[] | null;
  const accountId = router.query.account_id as string | string[] | null;
  const wallet = router.query.wallet as string | string[] | null;

  useEffect(() => {
    if (!Array.isArray(action) && accountId && (action === 'connect' || action === 'disconnect')) {
      const walletId = action === 'disconnect' ? (accountId as string) : undefined;

      connectDisconnectNearAccount(wallet as WalletTypeEnum, walletId).then(verified => {
        if (verified && Boolean(walletId)) return setPromptDisconnectSuccess(true);

        const successMessage = i18n.t('Wallet.Manage.Alert.Connect');
        const errorMessage = Boolean(walletId)
          ? i18n.t('Wallet.Manage.Alert.ErrorDisconnect')
          : i18n.t('Wallet.Manage.Alert.ErrorConnect');

        enqueueSnackbar({
          message: verified ? successMessage : errorMessage,
          variant: verified ? 'success' : 'error',
        });
      });
    }

    router.replace(router.route, undefined, {shallow: true});
  }, [action, accountId]);

  const closeAccountList = () => {
    setConfirmDisconnect(false);
    setShowAccountList(false);
    setWalletId(null);
  };

  const closeWalletList = () => {
    setShowWalletList(false);
    setConfirmDisconnect(false);
    setWalletId(null);
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

  const handleConnect = async (account?: InjectedAccountWithMeta, wallet?: WalletTypeEnum) => {
    closeAccountList();
    closeWalletList();

    const verified = await (account
      ? connectDisconnectNetwork(BlockchainPlatform.SUBSTRATE, account, walletId)
      : connectDisconnectNearAccount(wallet, walletId));

    if (verified && Boolean(walletId)) return setPromptDisconnectSuccess(true);
    if (initNear) return;
    const successMessage = i18n.t('Wallet.Manage.Alert.Connect');
    const errorMessage = Boolean(walletId)
      ? i18n.t('Wallet.Manage.Alert.ErrorDisconnect')
      : i18n.t('Wallet.Manage.Alert.ErrorConnect');

    enqueueSnackbar({
      message: verified ? successMessage : errorMessage,
      variant: verified ? 'success' : 'error',
    });
  };

  const connectDisconnectNearAccount = async (
    wallet: WalletTypeEnum,
    walletId?: string,
  ): Promise<boolean> => {
    const action = !walletId ? 'connect' : 'disconnect';
    const callbackUrl =
      publicRuntimeConfig.appAuthURL +
      router.route +
      `?type=manage&action=${action}&wallet=${wallet}`;

    try {
      if (!user) return false;

      const signatureData = await connectToNear(
        {successCallbackURL: callbackUrl, failedCallbackURL: callbackUrl},
        {userId: user.id},
        wallet,
        'connect',
      );

      if (!signatureData) return false;

      const payload = {
        publicAddress: signatureData.publicAddress,
        nearAddress: signatureData.publicAddress.split('/')[1],
        pubKey: signatureData.publicAddress.split('/')[0],
        signature: signatureData.signature,
        nonce: signatureData.nonce,
      };

      return connectDisconnectNetwork(BlockchainPlatform.NEAR, payload, walletId, async error => {
        if (error) await Near.clearLocalStorage();
      });
    } catch {
      return false;
    } finally {
      router.replace(router.route, undefined, {shallow: true});
    }
  };

  const handleSelectedNearWallet = async (wallet: WalletTypeEnum) => {
    handleConnect(undefined, wallet);
  };

  const onConnectDisconnect = (type: string, walletId?: string) => {
    setWalletId(walletId);

    switch (type) {
      case 'polkadot':
        setWalletName('polkadot{.js}');
        if (walletId) return setConfirmDisconnect(true);
        return checkExtensionInstalled();
      case 'near':
        setWalletName('NEAR');
        if (walletId) return setConfirmDisconnect(true);
        return setShowWalletList(true);
      default:
        break;
    }
  };

  const onShowNearWalletList = () => {
    setConfirmDisconnect(false);
    setShowWalletList(true);
    setInitNear(true);
  };

  const onConfirmDisconnect = async () => {
    if (walletName === 'NEAR') {
      return onShowNearWalletList();
    }

    await enablePolkadotExtension();

    const accounts = await getRegisteredAccounts();
    const currentAccount = accounts.find(account => toHexPublicKey(account) === walletId);
    if (!currentAccount) {
      setConfirmDisconnect(false);
      return enqueueSnackbar({
        message: i18n.t('Wallet.Manage.Alert.ErrorDisconnect'),
        variant: 'error',
      });
    }

    handleConnect(currentAccount);
  };

  return (
    <BoxComponent
      isWithChevronRightIcon={false}
      marginTop={'20px'}
      paddingLeft={isMobile ? 0 : 1}
      paddingRight={isMobile ? 0 : theme.spacing(3.75)}>
      <Manage
        currentWallet={currentWallet}
        wallets={wallets}
        onConnectDisconnect={onConnectDisconnect}
      />
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleConnect}
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
            {i18n.t('Wallet.Manage.Alert.Disconnect.Confirm.Subtitle', {name: walletName})}
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
