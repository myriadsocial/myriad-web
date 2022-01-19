import React from 'react';

import getConfig from 'next/config';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './help.style';

const {publicRuntimeConfig} = getConfig();

export const HelpComponent: React.FC = () => {
  const style = useStyles();

  const handleRedirectTermsAndConditions = () => {
    window.open(`/term-of-use`, '_blank');
  };

  const handleRedirectPrivacyAndPolicy = () => {
    window.open(`/privacy-policy`, '_blank');
  };

  const handleRedirectToTelegram = () => {
    window.open(`mailto:${publicRuntimeConfig.myriadSupportMail}`, '_blank');
  };

  return (
    <List className={style.root}>
      <ListItem className={style.item} alignItems="center">
        <ListItemText onClick={handleRedirectTermsAndConditions}>
          <Typography className={style.name} component="span" color="textPrimary">
            Terms and conditions
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem className={style.item} alignItems="center">
        <ListItemText onClick={handleRedirectPrivacyAndPolicy}>
          <Typography className={style.name} component="span" color="textPrimary">
            Privacy and Policy
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem className={style.item} alignItems="center">
        <ListItemText onClick={handleRedirectToTelegram}>
          <Typography className={style.name} component="span" color="textPrimary">
            Contact us
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  );
};
