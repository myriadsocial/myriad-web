import React, {useState, useEffect} from 'react';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  Button,
} from '@material-ui/core';

import {DropdownMenu} from '../atoms/DropdownMenu';
import {useStyles} from './Settings.styles';
import {accountPrivacyOptions} from './default';
import {useAccountSetting} from './hooks/use-account-setting.hook';
import {SettingsOption} from './hooks/use-setting-list.hook';

import {PrivacySettings, PrivacySettingType, PrivacyType} from 'src/interfaces/setting';
import i18n from 'src/locale';

type AccountSettingsProps = {
  value: PrivacySettings;
  onSaveSetting: (payload: PrivacySettings) => void;
};

export const AccountSettings: React.FC<AccountSettingsProps> = props => {
  const {value, onSaveSetting} = props;

  const [privacy, setPrivacy] = useState<PrivacySettings>(value);

  useEffect(() => {
    setPrivacy(value);
  }, [value]);

  const styles = useStyles();
  const settings = useAccountSetting();

  const changePrivacySetting =
    (item: SettingsOption<PrivacySettingType>) => (selected: PrivacyType) => {
      setPrivacy({...privacy, [item.id]: selected});
    };

  const savePrivacySetting = () => {
    onSaveSetting(privacy);
  };

  return (
    <Paper elevation={0} className={styles.root}>
      <List>
        {settings.map(item => {
          return (
            <ListItem key={item.id} className={styles.option} alignItems="center">
              <ListItemText>
                <Typography variant="h5" color="textPrimary">
                  {item.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {item.subtitle}
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction>
                <DropdownMenu<PrivacyType>
                  title=""
                  selected={privacy[item.id]}
                  options={accountPrivacyOptions}
                  onChange={changePrivacySetting(item)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <div className={styles.action}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          onClick={savePrivacySetting}>
          {i18n.t('Setting.List_Menu.Account_Setting.Confirm')}
        </Button>
      </div>
    </Paper>
  );
};
