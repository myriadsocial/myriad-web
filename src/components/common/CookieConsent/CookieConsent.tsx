import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';

import {Button, Drawer, Typography} from '@material-ui/core';

import {useStyles} from './CookieConsent.style';

type CookieConsentProps = {};

export const COOKIE_CONSENT_NAME = 'cookie-consent';

export const CookieConsent: React.FC<CookieConsentProps> = props => {
  const styles = useStyles();

  const [cookies, setCookie] = useCookies([COOKIE_CONSENT_NAME]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!cookies[COOKIE_CONSENT_NAME]) {
      setOpen(true);
    }
  }, [cookies]);

  const toggleDrawer = () => {
    setOpen(false);
  };

  const handleAccept = () => {
    setCookie(COOKIE_CONSENT_NAME, true);
    setOpen(false);
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer}
        classes={{
          root: styles.root,
        }}
        PaperProps={{className: styles.paper, square: false}}
        ModalProps={{keepMounted: true}}>
        <Typography variant="body1">
          This website uses cookies to enhance your online experience.
          <Typography href="/term-of-use" component="a" color="primary" className={styles.link}>
            Terms and Conditions
          </Typography>
        </Typography>
        <Button variant="contained" size="medium" color="primary" onClick={handleAccept}>
          Accept
        </Button>
      </Drawer>
    </>
  );
};
