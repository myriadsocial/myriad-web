import {XIcon} from '@heroicons/react/solid';

import {useState} from 'react';
import {usePWAInstall} from 'react-use-pwa-install';

import Image from 'next/image';

import {useTheme, useMediaQuery} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

const PwaWrapper = () => {
  const [isOpen, setOpen] = useState(true);
  const install = usePWAInstall();
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(isMobileAndTablet);

  const onInstall = () => {
    onClose();
    install();
  };

  const onClose = () => setOpen(false);

  if (!install || !isMobileAndTablet) return null;

  return (
    <Snackbar
      anchorOrigin={{horizontal: 'center', vertical: 'top'}}
      open={isOpen}
      onClose={() => setOpen(false)}>
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
