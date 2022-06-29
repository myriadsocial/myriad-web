import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './Help.style';

import i18n from 'src/locale';

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
            {i18n.t('Setting.List_Menu.Help_Setting.Terms_and_conditions')}
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem className={style.item} alignItems="center">
        <ListItemText onClick={handleRedirectPrivacyAndPolicy}>
          <Typography className={style.name} component="span" color="textPrimary">
            {i18n.t('Setting.List_Menu.Help_Setting.Privacy_and_policy')}
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem className={style.item} alignItems="center">
        <ListItemText onClick={handleRedirectToTelegram}>
          <Typography className={style.name} component="span" color="textPrimary">
            {i18n.t('Setting.List_Menu.Help_Setting.Contact_us')}
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  );
};
