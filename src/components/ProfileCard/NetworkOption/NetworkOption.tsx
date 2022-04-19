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

import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import {useAuthHook} from 'src/hooks/auth.hook';
import {NearPayload} from 'src/hooks/auth.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {UserWallet} from 'src/interfaces/user';
import {Network} from 'src/interfaces/wallet';
import {AccountRegisteredError} from 'src/lib/api/errors/account-registered.error';
import {NetworkTypeEnum, WalletTypeEnum} from 'src/lib/api/ext-auth';
import {toHexPublicKey} from 'src/lib/crypto';
import {clearNearAccount} from 'src/lib/services/near-api-js';

export type NetworkOptionProps = {
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
  networks: Network[];
};

export const NetworkOption: React.FC<NetworkOptionProps> = ({currentWallet, wallets, networks}) => {
  const router = useRouter();
  const styles = useStyles();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {switchNetwork, getRegisteredAccounts} = useAuthHook();
  const {connectToNear} = useNearApi();
  const confirm = useConfirm();
  const {openToasterSnack} = useToasterSnackHook();
  const {publicRuntimeConfig} = getConfig();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [current, setCurrent] = React.useState<string>(
    currentWallet?.networkId ? currentWallet?.networkId : networks[0].id,
  );
  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  const [network, setNetwork] = React.useState<NetworkTypeEnum | null>(null);

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
    currentWallet && setCurrent(currentWallet?.networkId);
  }, [currentWallet]);

  useEffect(() => {
    const query = router.query;

    if (!Array.isArray(query.action) && query.action === 'switch' && query.account_id) {
      handleSelected(WalletTypeEnum.NEAR, NetworkTypeEnum.NEAR, true);
    }
  }, [router.query]);

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
    walletType: string,
    networkType: NetworkTypeEnum,
    refresh = false,
  ) => {
    handleClose();

    if (networkType !== current) {
      const wallet = wallets?.find(wallet => wallet.type === walletType);

      switch (wallet?.type) {
        case WalletTypeEnum.POLKADOT: {
          checkExtensionInstalled(networkType);
          break;
        }

        case WalletTypeEnum.NEAR: {
          const callback = publicRuntimeConfig.appAuthURL + router.route + '?action=switch';

          const data = await connectToNear(callback);

          if (data) {
            const payload: NearPayload = {
              publicAddress: data.publicAddress,
              nearAddress: data.publicAddress.split('/')[1],
              pubKey: data.publicAddress.split('/')[0],
              signature: data.signature,
            };

            await handleSwitch(wallet.type, networkType, payload);

            router.replace(router.route, undefined, {shallow: true});
          } else {
            console.log('redirection to near auth page');
          }
          break;
        }

        default:
          handleOpenPrompt(walletType);
      }
    }
  };

  const handleSwitch = async (
    walletType: WalletTypeEnum,
    network: NetworkTypeEnum,
    account: InjectedAccountWithMeta | NearPayload,
  ) => {
    try {
      await switchNetwork(account, network, walletType, () => {
        setCurrent(network);
        setNetwork(null);
        closeAccountList();
      });
    } catch (error) {
      if (error instanceof AccountRegisteredError) {
        await clearNearAccount();
        openToasterSnack({
          message: 'Failed! ' + error.message,
          variant: 'error',
        });
      }
    }
  };

  const getSelectedText = (): string => {
    const selectedNetwork = networks.find(option => option.id === current);
    return formatTitle(selectedNetwork?.id) ?? currentWallet?.networkId ?? '';
  };

  const getSelectedIcon = () => {
    const match = networks.find(option => option.id === current);

    return match?.id && icons[match.id as keyof typeof icons];
  };

  // POLKADOT
  const checkExtensionInstalled = async (network: NetworkTypeEnum) => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts(network);
  };

  const getAvailableAccounts = async (network: NetworkTypeEnum) => {
    const accounts = (await getRegisteredAccounts()).filter(
      account =>
        toHexPublicKey(account) ===
        wallets?.filter(wallet => wallet.type === WalletTypeEnum.POLKADOT)[0].id,
    );

    setAccounts(accounts);
    setNetwork(network);
  };

  const handleSelectPolkadotAccount = (account: InjectedAccountWithMeta) => {
    if (network) {
      handleSwitch(WalletTypeEnum.POLKADOT, network, account);
    }
  };

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const showConfirmDialog = (selected: string) => {
    const selectedWallet = networks.find(option => option.id == selected);
    confirm({
      title: `You didn’t connect your ${formatTitle(selectedWallet?.id)}!`,
      description: `This account is not connected with ${formatTitle(
        selectedWallet?.walletType,
        true,
      )}. Please connect to ${formatTitle(
        selectedWallet?.walletType,
        true,
      )} in wallet manage tab. Do you want to connect your account?`,
      icon: 'warning',
      confirmationText: 'Yes',
      cancellationText: 'Cancel',
      onConfirm: () => {
        handleConnectWallet();
      },
    });
  };

  const formatTitle = (id?: string, wallet?: boolean) => {
    if (wallet)
      switch (id) {
        case WalletTypeEnum.POLKADOT:
          return 'Polkadot{.js}';
        case WalletTypeEnum.NEAR:
          return 'NEAR Wallet';
        default:
          return id;
      }

    switch (id) {
      case NetworkTypeEnum.POLKADOT:
        return 'Polkadot';
      case NetworkTypeEnum.NEAR:
        return 'NEAR';
      case NetworkTypeEnum.KUSAMA:
        return 'Kusama';
      case NetworkTypeEnum.MYRIAD:
        return 'Myriad';
      default:
        return id;
    }
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
        {networks.map(option => (
          <MenuItem
            key={option.id}
            onClick={() => handleSelected(option.walletType, option.id as NetworkTypeEnum)}
            className={option.id === current ? styles.menu : ''}>
            <ListItemIcon>{icons[option.id as keyof typeof icons]}</ListItemIcon>
            <ListItemText>{formatTitle(option.id)}</ListItemText>
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
