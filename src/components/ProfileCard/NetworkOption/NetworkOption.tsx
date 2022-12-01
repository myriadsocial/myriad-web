import {ChevronDownIcon} from '@heroicons/react/outline';

import React from 'react';

import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './networkOption.style';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
  DebioNetworkIcon,
} from 'src/components/atoms/Icons';
import {formatNetworkTitle} from 'src/helpers/wallet';
import {Network} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';

export type NetworkOptionProps = {
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
  networks: Network[];
  isMobile?: boolean;
};

export const NetworkOption: React.FC<NetworkOptionProps> = ({
  currentWallet,
  networks,
  isMobile = false,
}) => {
  const styles = useStyles();

  const {switchNetwork} = useBlockchain();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentNetworkId = currentWallet?.networkId;

  const icons = React.useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon />,
      kusama: <KusamaNetworkIcon />,
      near: <NearNetworkIcon24 />,
      myriad: <MyriadCircleIcon />,
      debio: <DebioNetworkIcon />,
    }),
    [],
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchNetwork = async (network: Network) => {
    handleClose();
    switchNetwork(network);
  };

  const getSelectedText = (): string => {
    const selectedNetwork = networks.find(network => network.id === currentNetworkId);
    return formatNetworkTitle(selectedNetwork) ?? currentWallet?.networkId ?? '';
  };

  const getSelectedIcon = () => {
    const match = networks.find(network => network.id === currentNetworkId);

    return match?.id && icons[match.id as keyof typeof icons];
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
            onClick={() => handleSwitchNetwork(network)}
            disabled={!isMobile ? false : network.id === 'near' ? false : true}
            className={network.id === currentNetworkId ? styles.menu : ''}>
            <ListItemIcon>{icons[network.id as keyof typeof icons]}</ListItemIcon>
            <ListItemText>{formatNetworkTitle(network)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NetworkOption;
