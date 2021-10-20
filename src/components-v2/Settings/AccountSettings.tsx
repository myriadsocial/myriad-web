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
import {SettingsOption} from './hooks/use-setting-list.hook';

import {PrivacySettings, PrivacySettingType, PrivacyType} from 'src/interfaces/setting';

type AccountSettingsProps = {
  value: PrivacySettings;
  onSaveSetting: (key: PrivacySettingType, value: PrivacyType) => void;
};

export const AccountSettings: React.FC<AccountSettingsProps> = props => {
  const {value, onSaveSetting} = props;

  const styles = useStyles();
  const settings = useAccountSetting();

  const changePrivacySetting = (item: SettingsOption<PrivacySettingType>) => (selected: string) => {
    onSaveSetting(item.id, selected as PrivacyType);
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
                  selected={value[item.id]}
                  options={accountPrivacyOptions}
                  onChange={changePrivacySetting(item)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
