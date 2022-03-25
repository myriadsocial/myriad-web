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

import {useStyles} from './networkOption.style';

import {MenuOptions} from 'src/components/atoms/DropdownMenu';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import {CurrentUserWallet} from 'src/interfaces/user';

export type NetworkOptionProps = {
  currentWallet?: CurrentUserWallet;
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

export const NetworkOption: React.FC<NetworkOptionProps> = ({currentWallet}) => {
  const styles = useStyles();
  const router = useRouter();
  const confirm = useConfirm();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [current, setCurrent] = React.useState<string>(
    currentWallet?.network ? currentWallet?.network : networkOptions[0].id,
  );

  const icons = React.useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon />,
      kusama: <KusamaNetworkIcon />,
      near: <NearNetworkIcon24 />,
      myriad: <MyriadCircleIcon />,
    }),
    [],
  );

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
    else if (currentWallet?.networks.find(network => network === option)) setCurrent(option);
    else handleOpenPrompt(option);
    handleClose();
  };

  const getSelectedText = (): string => {
    const match = networkOptions.find(option => option.id === current);

    return match?.title ?? '';
  };

  const getSelectedIcon = () => {
    const match = networkOptions.find(option => option.id === current);

    return match?.id && icons[match.id as keyof typeof icons];
  };

  const showConfirmDialog = (selected: string) => {
    confirm({
      title: `You did’nt connect your ${selected}!`,
      description: `This account is not connected with ${selected}. Please connect to ${selected} in wallet manage tab. Do you want to connect your account?`,
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
    </>
  );
};
