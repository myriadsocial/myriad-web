import {ChevronDownIcon} from '@heroicons/react/outline';

import React from 'react';

import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {Skeleton} from '@material-ui/lab';

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
import {Network, NetworkIdEnum} from 'src/interfaces/network';

export type NetworkOptionProps = {
  networks: Network[];
  isMobile?: boolean;
};

export const NetworkOption: React.FC<NetworkOptionProps> = ({networks, isMobile = false}) => {
  const styles = useStyles();
  const router = useRouter();

  const nearLoading = router?.query?.loading;
  const loading = nearLoading === 'true';

  const {switchNetwork} = useBlockchain();
  const {data: session} = useSession();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
    const networkId = session?.user?.networkType as NetworkIdEnum;
    return formatNetworkTitle(networkId);
  };

  const getSelectedIcon = () => {
    const networkId = session?.user?.networkType as NetworkIdEnum;
    return networkId && icons[networkId as keyof typeof icons];
  };

  if (loading) {
    return (
      <Typography component="div" className={styles.network}>
        <Skeleton variant="text" height={20} />
      </Typography>
    );
  }

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
            className={network.id === session?.user?.networkType ? styles.menu : ''}>
            <ListItemIcon>{icons[network.id as keyof typeof icons]}</ListItemIcon>
            <ListItemText>{formatNetworkTitle(network.id)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NetworkOption;
