import React from 'react';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';

import {DropdownMenu} from '../atoms/DropdownMenu/';
import {useStyles} from './Settings.styles';
import {accountPrivacyOptions} from './default';
import {useAccountSetting} from './hooks/use-account-setting.hook';

type AccountSettingsProps = {
  onSaveSetting: () => void;
};

export const AccountSettings: React.FC<AccountSettingsProps> = () => {
  const styles = useStyles();
  const settings = useAccountSetting();

  const handleSelectOption = (item: string) => {
    console.log(item);
  };

  return (
    <Paper className={styles.root}>
      <List>
        {settings.map(item => {
          return (
            <ListItem key={item.id} button className={styles.option} alignItems="center">
              <ListItemText>
                <Typography variant="h5" color="textPrimary">
                  {item.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {item.subtitle}
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction>
                <DropdownMenu
                  title=""
                  selected={accountPrivacyOptions[0].id}
                  options={accountPrivacyOptions}
                  onChange={handleSelectOption}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
