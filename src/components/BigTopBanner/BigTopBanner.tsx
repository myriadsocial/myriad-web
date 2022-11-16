import {memo} from 'react';

import {useRouter} from 'next/router';

import {Container, Button} from '@material-ui/core';

import useStyles from './BigTopBanner.styles';

import {CommonWalletIcon} from 'components/atoms/Icons';

const BigTopBanner = () => {
  const classes = useStyles();
  const router = useRouter();
  const handleConnectWeb3Wallet = () => {
    router.push(`/wallet?type=manage`);
  };
  return (
    <div className={classes.bannerRoot}>
      <Container maxWidth="lg" className={classes.bannerContainer} disableGutters>
        <div className={classes.bannerWrap}>
          <div className={classes.bannerText}>
            You are using Myriad Lite Version. Connect your crypto wallet to unlock more features.
          </div>
          <Button
            variant="outlined"
            className={classes.connectWalletButton}
            size="small"
            onClick={handleConnectWeb3Wallet}>
            <CommonWalletIcon viewBox="1 -2.4 18.4 18.4" />
            <span style={{paddingLeft: '6px'}}>Connect Wallet</span>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default memo(BigTopBanner);
