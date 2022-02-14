import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './help.style';

type HelpComponentProps = {
  support: string;
};

export const HelpComponent: React.FC<HelpComponentProps> = props => {
  const {support} = props;

  const style = useStyles();

  const handleRedirectTermsAndConditions = () => {
    window.open(`/term-of-use`, '_blank');
  };

  const handleRedirectPrivacyAndPolicy = () => {
    window.open(`/privacy-policy`, '_blank');
  };

  const handleRedirectToTelegram = () => {
    window.open(`mailto:${support}`, '_blank');
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
