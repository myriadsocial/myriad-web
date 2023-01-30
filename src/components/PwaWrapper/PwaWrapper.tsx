import {XIcon} from '@heroicons/react/solid';

import {useState} from 'react';
import {useCookies} from 'react-cookie';
import {usePWAInstall} from 'react-use-pwa-install';

import Image from 'next/image';

import {useTheme, useMediaQuery} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

export const HIDE_PWA_INSTALL_POPUP_COOKIE_KEY = 'hide-pwa-install-popup';

const PwaWrapper = () => {
  const [cookies, setCookie] = useCookies([HIDE_PWA_INSTALL_POPUP_COOKIE_KEY]);
  const [isOpen, setOpen] = useState(true);
  const install = usePWAInstall();
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const onInstall = () => {
    onClose();
    install();
  };

  const onClose = () => {
    setOpen(false);
    setCookie(HIDE_PWA_INSTALL_POPUP_COOKIE_KEY, true);
  };

  if (!isMobileAndTablet || Boolean(cookies[HIDE_PWA_INSTALL_POPUP_COOKIE_KEY]) || !install)
    return null;

  return (
    <Snackbar
      anchorOrigin={{horizontal: 'center', vertical: 'top'}}
      open={isOpen}
      onClose={onClose}>
      <Box
        sx={{
          bgcolor: '#201c1c',
          borderRadius: '10px',
          color: 'white',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          gridGap: '10px',
        }}>
        <XIcon
          onClick={onClose}
          style={{width: '20px', height: '20px', position: 'absolute', top: '5px', right: '7px'}}
        />
        <Image
          src="/android-chrome-48x48.png"
          alt="myriadLogo"
          width={40}
          height={40}
          quality={100}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '6px',
            paddingRight: '40px',
            gridGap: '70px',
          }}>
          <Box sx={{minWidth: '100px'}}>
            <Typography variant="body1">Add Myriad</Typography>
            <Typography variant="body1">To Home Screen</Typography>
          </Box>
          <Box onClick={onInstall}>
            <Typography variant="body2" color="primary">
              Install
            </Typography>
          </Box>
        </Box>
      </Box>
    </Snackbar>
  );
};

export default PwaWrapper;
