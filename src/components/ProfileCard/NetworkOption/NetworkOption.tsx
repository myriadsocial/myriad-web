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
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {UserWallet} from 'src/interfaces/user';
import {NetworkTypeEnum, WalletTypeEnum} from 'src/lib/api/ext-auth';
import {toHexPublicKey} from 'src/lib/crypto';

export type NetworkOptionProps = {
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
};

const networkOptions: MenuOptions<string>[] = [
  {
    id: 'polkadot',
    title: 'Polkadot',
  },
  {
    id: 'kusama',
    title: 'Kusama',
  },
  {
    id: 'near',
    title: 'NEAR',
  },
  {
    id: 'myriad',
    title: 'Myriad',
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

  const handleSelected = (option: string) => {
    if (option === current) handleClose();
    else if (wallets?.map(wallet => wallet.network).find(network => network === option)) {
      if (option === NetworkTypeEnum.POLKADOT) {
        checkExtensionInstalled();
      }
      if (option === NetworkTypeEnum.NEAR) {
        handleSwitch(option);
      }
    } else handleOpenPrompt(option);
    handleClose();
  };

  const handleSwitch = async (option: string, account?: InjectedAccountWithMeta) => {
    if (option === WalletTypeEnum.POLKADOT) {
      switchNetwork(account, undefined, () => {
        setCurrent(option as string);
        closeAccountList();
      });
    }
    if (option === WalletTypeEnum.NEAR) {
      // TODO SWITCH NEAR WITH CONNECTED NEAR ACCOUNT
      const {publicAddress, signature} = await connectToNear();
      const payload = {
        publicAddress,
        nearAddress: publicAddress.split('/')[1],
        pubKey: publicAddress.split('/')[0],
        signature,
      };

      switchNetwork(undefined, payload, () => {
        setCurrent(option as string);
      });
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
  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts();
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();
    setAccounts(
      accounts.filter(
        account =>
          toHexPublicKey(account) ==
          wallets?.filter(wallet => wallet.type === NetworkTypeEnum.POLKADOT)[0].id,
      ),
    );
  };

  const handleSelectPolkadotAccount = (account: InjectedAccountWithMeta) => {
    handleSwitch('polkadot', account);
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
            onClick={() => handleSelected(option.id)}
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
