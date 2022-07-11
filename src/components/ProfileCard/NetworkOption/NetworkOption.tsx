import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useEffect} from 'react';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {PolkadotAccountList} from '../../PolkadotAccountList';
import {useStyles} from './networkOption.style';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import {formatNetworkTitle, formatWalletTitle} from 'src/helpers/wallet';
import {useAuthHook} from 'src/hooks/auth.hook';
import {NearPayload} from 'src/hooks/auth.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {NetworkIdEnum, Network} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';
import {BlockchainPlatform} from 'src/interfaces/wallet';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import {toHexPublicKey} from 'src/lib/crypto';
import {clearNearAccount} from 'src/lib/services/near-api-js';

export type NetworkOptionProps = {
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
  networks: Network[];
  isMobile?: boolean;
};

export const NetworkOption: React.FC<NetworkOptionProps> = ({
  currentWallet,
  wallets,
  networks,
  isMobile = false,
}) => {
  const router = useRouter();
  const styles = useStyles();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {switchNetwork, getRegisteredAccounts} = useAuthHook();
  const {connectToNear} = useNearApi();
  const confirm = useConfirm();
  const enqueueSnackbar = useEnqueueSnackbar();
  const {publicRuntimeConfig} = getConfig();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  const [networkId, setNetworkId] = React.useState<NetworkIdEnum | null>(null);
  const currentNetworkId = currentWallet?.networkId;

  const accountId = router.query.account_id as string | null;
  const action = router.query.action as string | string[] | null;

  const icons = React.useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon />,
      kusama: <KusamaNetworkIcon />,
      near: <NearNetworkIcon24 />,
      myriad: <MyriadCircleIcon />,
    }),
    [],
  );

  useEffect(() => {
    if (!Array.isArray(action) && action === 'switch' && accountId) {
      handleSelected(BlockchainPlatform.NEAR, NetworkIdEnum.NEAR, true);
    }
  }, [accountId, action]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenPrompt = (select: string) => {
    showConfirmDialog(select);
  };

  const handleConnectWallet = () => {
    router.push(`/wallet?type=manage`);
  };

  const handleSelected = async (
    blockchainPlatform: BlockchainPlatform,
    networkId: NetworkIdEnum,
    refresh = false,
  ) => {
    handleClose();

    if (networkId !== currentNetworkId) {
      const wallet = wallets?.find(
        wallet => wallet?.network?.blockchainPlatform === blockchainPlatform,
      );

      switch (wallet?.network?.blockchainPlatform) {
        case 'substrate': {
          checkExtensionInstalled(networkId);
          break;
        }

        case 'near': {
          const callbackUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);
          const redirectUrl = new URL(router.asPath, publicRuntimeConfig.appAuthURL);
          // clear previous query param
          redirectUrl.hash = '';
          redirectUrl.search = '';
          callbackUrl.hash = '';
          callbackUrl.search = '';

          callbackUrl.searchParams.set('action', 'switch');

          if (router.query?.q && !Array.isArray(router.query?.q)) {
            callbackUrl.searchParams.set('q', router.query.q);
            redirectUrl.searchParams.set('q', router.query.q);
          }

          const data = await connectToNear(callbackUrl.toString());

          if (data) {
            const payload: NearPayload = {
              publicAddress: data.publicAddress,
              nearAddress: data.publicAddress.split('/')[1],
              pubKey: data.publicAddress.split('/')[0],
              signature: data.signature,
            };

            await handleSwitch(BlockchainPlatform.NEAR, networkId, payload);

            router.replace(redirectUrl, undefined, {shallow: true});
          } else {
            console.log('redirection to near auth page');
          }
          break;
        }

        default:
          handleOpenPrompt(networkId);
      }
    }
  };

  const handleSwitch = async (
    blockchainPlatform: BlockchainPlatform,
    networkId: NetworkIdEnum,
    account: InjectedAccountWithMeta | NearPayload,
  ) => {
    try {
      await switchNetwork(blockchainPlatform, networkId, account, () => {
        setNetworkId(null);
        closeAccountList();
      });
    } catch (error) {
      if (error instanceof AccountRegisteredError) {
        await clearNearAccount();

        enqueueSnackbar({
          message: 'Failed! ' + error.message,
          variant: 'error',
        });
      }
    }
  };

  const getSelectedText = (): string => {
    const selectedNetwork = networks.find(network => network.id === currentNetworkId);
    return formatNetworkTitle(selectedNetwork) ?? currentWallet?.networkId ?? '';
  };

  const getSelectedIcon = () => {
    const match = networks.find(network => network.id === currentNetworkId);

    return match?.id && icons[match.id as keyof typeof icons];
  };

  // POLKADOT
  const checkExtensionInstalled = async (networkId: NetworkIdEnum) => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts(networkId);
  };

  const getAvailableAccounts = async (networkId: NetworkIdEnum) => {
    const accounts = (await getRegisteredAccounts()).filter(
      account =>
        toHexPublicKey(account) ===
        wallets?.filter(
          wallet => wallet?.network?.blockchainPlatform === BlockchainPlatform.SUBSTRATE,
        )[0].id,
    );

    setAccounts(accounts);
    setNetworkId(networkId);
  };

  const handleSelectPolkadotAccount = (account: InjectedAccountWithMeta) => {
    if (networkId) {
      handleSwitch(BlockchainPlatform.SUBSTRATE, networkId, account);
    }
  };

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const showConfirmDialog = (selected: string) => {
    const selectedNetwork = networks.find(option => option.id == selected);

    confirm({
      title: `You didn’t connect your ${formatNetworkTitle(selectedNetwork)}!`,
      description: `This account is not connected with ${formatWalletTitle(
        selectedNetwork,
      )}. Please connect to ${formatWalletTitle(
        selectedNetwork,
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
      <Button
        onClick={handleClick}
        className={styles.walletButton}
        startIcon={getSelectedIcon()}
        endIcon={<SvgIcon color="primary" component={ChevronDownIcon} viewBox="0 0 24 24" />}
        size="small"
        variant="contained"
        color="inherit">
        <Typography component="span">{getSelectedText()}</Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {networks.map(network => (
          <MenuItem
            key={network.id}
            onClick={() => handleSelected(network.blockchainPlatform, network.id)}
            disabled={!isMobile ? false : network.id === 'near' ? false : true}
            className={network.id === currentNetworkId ? styles.menu : ''}>
            <ListItemIcon>{icons[network.id as keyof typeof icons]}</ListItemIcon>
            <ListItemText>{formatNetworkTitle(network)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleSelectPolkadotAccount}
        onClose={closeAccountList}
      />
    </>
  );
};

export default NetworkOption;
