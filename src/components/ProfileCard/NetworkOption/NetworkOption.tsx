import {ChevronDownIcon} from '@heroicons/react/outline';

import React from 'react';

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

import {MenuOptions} from 'src/components/atoms/DropdownMenu';
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
import {UserWallet} from 'src/interfaces/user';
import {NetworkTypeEnum, WalletTypeEnum} from 'src/lib/api/ext-auth';
import {toHexPublicKey} from 'src/lib/crypto';

export type NetworkOptionProps = {
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
};

type NetworkMenuOption = MenuOptions<string> & {
  walletType: string;
};

const networkOptions: NetworkMenuOption[] = [
  {
    id: 'polkadot',
    title: 'Polkadot',
    walletType: WalletTypeEnum.POLKADOT,
  },
  {
    id: 'kusama',
    title: 'Kusama',
    walletType: WalletTypeEnum.POLKADOT,
  },
  {
    id: 'near',
    title: 'NEAR',
    walletType: WalletTypeEnum.NEAR,
  },
  {
    id: 'myriad',
    title: 'Myriad',
    walletType: WalletTypeEnum.POLKADOT,
  },
];

export const NetworkOption: React.FC<NetworkOptionProps> = ({currentWallet, wallets}) => {
  const router = useRouter();
  const styles = useStyles();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {switchNetwork, getRegisteredAccounts} = useAuthHook();
  const {connectToNear} = useNearApi();
  const confirm = useConfirm();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [current, setCurrent] = React.useState<string>(
    currentWallet?.network ? currentWallet?.network : networkOptions[0].id,
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

  React.useEffect(() => {
    currentWallet && setCurrent(currentWallet?.network);
  }, [currentWallet]);

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

  const handleSelected = async (walletType: string, networkType: NetworkTypeEnum) => {
    if (networkType === current) handleClose();
    else {
      const wallet = wallets?.find(wallet => wallet.type === walletType);

      switch (wallet?.type) {
        case WalletTypeEnum.POLKADOT: {
          checkExtensionInstalled(networkType);
          break;
        }

        case WalletTypeEnum.NEAR: {
          const {publicAddress, signature} = await connectToNear();
          const payload: NearPayload = {
            publicAddress,
            nearAddress: publicAddress.split('/')[1],
            pubKey: publicAddress.split('/')[0],
            signature,
          };
          handleSwitch(wallet.type, networkType, payload);
          break;
        }

        default:
          handleOpenPrompt(walletType);
      }
    }
    handleClose();
  };

  const handleSwitch = async (
    walletType: string,
    network: NetworkTypeEnum,
    account: InjectedAccountWithMeta | NearPayload,
  ) => {
    switch (walletType) {
      case WalletTypeEnum.POLKADOT: {
        switchNetwork(account, network, walletType, () => {
          setCurrent(walletType as string);
          setNetwork(null);
          closeAccountList();
        });
        break;
      }

      case WalletTypeEnum.NEAR: {
        // TODO SWITCH NEAR WITH CONNECTED NEAR ACCOUNT
        const {publicAddress, signature} = await connectToNear();
        const payload: NearPayload = {
          publicAddress,
          nearAddress: publicAddress.split('/')[1],
          pubKey: publicAddress.split('/')[0],
          signature,
        };

        switchNetwork(payload, NetworkTypeEnum.NEAR, walletType, () => {
          setCurrent(walletType as string);
        });
        break;
      }
    }
  };

  const getSelectedText = (): string => {
    const match = networkOptions.find(option => option.id === current);

    return match?.title ?? '';
  };

  const getSelectedIcon = () => {
    const match = networkOptions.find(option => option.id === current);

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
    const selectedWallet = networkOptions.find(option => option.id == selected);
    confirm({
      title: `You did’nt connect your ${selectedWallet?.title}!`,
      description: `This account is not connected with ${selectedWallet?.title}. Please connect to ${selectedWallet?.title} in wallet manage tab. Do you want to connect your account?`,
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
        {networkOptions.map(option => (
          <MenuItem
            key={option.id}
            onClick={() => handleSelected(option.walletType, option.id as NetworkTypeEnum)}
            className={option.id === current ? styles.menu : ''}>
            <ListItemIcon>{icons[option.id as keyof typeof icons]}</ListItemIcon>
            <ListItemText>{option.title}</ListItemText>
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
