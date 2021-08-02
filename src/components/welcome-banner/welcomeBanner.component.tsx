import React, {useState, forwardRef, useImperativeHandle} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import DialogTitle from '../common/DialogTitle.component';
import {useStyles} from './welcomeBanner.style';

import BannerImage from 'src/images/banner-welcome.svg';

export type WelcomeBannerComponentProps = {
  triggerWelcomeBanner: () => void;
};

// eslint-disable-next-line react/display-name
export const WelcomeBannerComponent = forwardRef(
  (_, ref: React.Ref<WelcomeBannerComponentProps>) => {
    const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
    const styles = useStyles();

    useImperativeHandle(
      ref,
      () => ({
        triggerWelcomeBanner: () => {
          setShowWelcomeBanner(true);
        },
      }),
      [],
    );

    const closeWelcomeBanner = () => {
      setShowWelcomeBanner(false);
    };

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
              <br /> Claim your freedom. Become the master of your own social media experience.{' '}
              <br />
              <br />
            </Typography>
            <Typography className={`${styles.paragraph} ${styles.center} ${styles.mb2}`}>
              <Link href={'https://wiki.acala.network/learn/get-started#get-test-tokens'}>
                <a
                  href={'https://wiki.acala.network/learn/get-started#get-test-tokens'}
                  target="_blank"
                  rel="noreferrer">
                  Get more free testnet aUSD
                </a>
              </Link>
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
  },
);
