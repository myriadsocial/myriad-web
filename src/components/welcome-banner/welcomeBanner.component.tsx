import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import DialogTitle from '../common/DialogTitle.component';
import {useStyles} from './welcomeBanner.style';

import localforage from 'localforage';
import {delay} from 'lodash';
import BannerImage from 'src/images/banner-welcome.svg';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export type WelcomeBannerComponentProps = {
  triggerWelcomeBanner: () => void;
};

type WelcomeBannerConfig = {
  enabled: boolean;
};

export const WelcomeBannerComponent = (): JSX.Element | null => {
  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    delay(() => {
      getWelcomeBannerConfig();
    }, 1000);
  }, []);

  const getWelcomeBannerConfig = async () => {
    const welcomeBannerConfig = (await localforage.getItem(
      'banner_enabled',
    )) as WelcomeBannerConfig | null;

    if (welcomeBannerConfig) {
      setShowWelcomeBanner(welcomeBannerConfig.enabled);
    } else {
      setShowWelcomeBanner(true);
    }
  };

  const storeWelcomeBannerConfig = async (config: WelcomeBannerConfig) => {
    await localforage.setItem('banner_enabled', config);
  };

  const closeWelcomeBanner = () => {
    setShowWelcomeBanner(false);
    storeWelcomeBannerConfig({
      enabled: false,
    });
  };

  if (anonymous) return null;

  return (
    <>
      <Dialog
        open={showWelcomeBanner}
        onClose={closeWelcomeBanner}
        aria-labelledby="welcome-banner-dialog"
        maxWidth="md">
        <DialogTitle id="name" onClose={closeWelcomeBanner}>
          {''}
        </DialogTitle>
        <DialogContent dividers>
          <div className={styles.center}>
            <BannerImage />
          </div>
          <Typography className={`${styles.paragraph} ${styles.primary} ${styles.center}`}>
            Welcome to Myriad Demo
          </Typography>
          <Typography className={`${styles.paragraph} ${styles.center}`}>
            <br /> Thanks for trying this app, you get free 10 aUSD test token.
            <br /> Claim your freedom. Become the master of your own social media experience. <br />
            <br />
          </Typography>
          <Typography className={`${styles.paragraph} ${styles.center} ${styles.mb2}`}>
            <a
              href={'https://wiki.acala.network/learn/get-started#get-test-tokens'}
              target="_blank"
              rel="noreferrer">
              Get more free testnet aUSD
            </a>
          </Typography>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            style={{width: 300}}
            onClick={closeWelcomeBanner}>
            {"Let's get started!"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
