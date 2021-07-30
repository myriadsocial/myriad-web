import React, {useState, forwardRef, useImperativeHandle} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import DialogTitle from '../common/DialogTitle.component';
import {useStyles} from './welcomeBanner.style';

export type WelcomeBannerComponentProps = {
  triggerWelcomeBanner: () => void;
};

export const WelcomeBannerComponent = forwardRef(
  (_, ref: React.Ref<WelcomeBannerComponentProps>) => {
    const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
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
            ''
          </DialogTitle>
          <DialogContent dividers>
            <Typography>Welcome to Myriad Demo</Typography>
            <Typography>
              <br /> Thanks for trying this app, you get free 10 aUSD test token.
              <br /> Claim your freedom. Become the master of your own social media experience.{' '}
              <br />
              <Link
                href={'https://wiki.acala.network/learn/get-started#get-test-tokens'}
                onClick={e => e.preventDefault()}>
                Get more free testnet aUSD
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
              Let's get started!
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
);
