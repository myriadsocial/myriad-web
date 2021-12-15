import React from 'react';

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

import {PrivacySettings, PrivacySettingType} from 'src/interfaces/setting';

type AccountSettingsProps = {
  value: PrivacySettings;
  onSaveSetting: (payload: PrivacySettings) => void;
};

export const AccountSettings: React.FC<AccountSettingsProps> = props => {
  const {value, onSaveSetting} = props;
  const [privacy, setPrivacy] = React.useState({
    accountPrivacy: value.accountPrivacy,
    socialMediaPrivacy: value.socialMediaPrivacy,
  });

  React.useEffect(() => {
    setPrivacy(value);
  }, [value]);

  const styles = useStyles();
  const settings = useAccountSetting();

  const changePrivacySetting = (item: SettingsOption<PrivacySettingType>) => (selected: string) => {
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
                <DropdownMenu
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
          Save Changes
        </Button>
      </div>
    </Paper>
  );
};
