import {XIcon} from '@heroicons/react/solid';

import {
  /* useEffect, */
  useState,
} from 'react';
import {useReactPWAInstall} from 'react-pwa-install';

import Image from 'next/image';

import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

const PwaWrapper = () => {
  const [isOpen, setOpen] = useState(true);
  const {pwaInstall, supported, isInstalled} = useReactPWAInstall();
  // useEffect(() => {
  //   window.addEventListener('beforeinstallprompt', function (event: BeforeInstallPromptEvent) {
  //     // Don't display the standard one
  //     event.preventDefault();

  //     console.log('ini event', event);
  //     setTimeout(() => {
  //       console.log('ini trigger prompt');
  //       setOpen(true);
  //     }, 2000);
  //   });
  // }, []);

  const onInstall = () => {
    pwaInstall({
      description: 'Add Myriad App To Home Screen',
    });
  };

  const onClose = () => setOpen(false);

  if (isInstalled() && !supported()) return null;

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
            gridGap: '100px',
          }}>
          <Box>
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
