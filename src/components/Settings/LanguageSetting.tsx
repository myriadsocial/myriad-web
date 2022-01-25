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
import {settingLanguageOptions} from './default';

import {LanguageSettingType} from 'src/interfaces/setting';
import i18n from 'src/locale';

type LanguageSettingsProps = {
  value: LanguageSettingType;
  onSaveSetting: (payload: LanguageSettingType) => void;
};

export const LanguageSetting: React.FC<LanguageSettingsProps> = props => {
  const {value, onSaveSetting} = props;
  const [language, setLanguage] = React.useState<LanguageSettingType>(value);

  React.useEffect(() => {
    setLanguage(value);
  }, [value]);

  const styles = useStyles();

  const changeLanguageSetting = (selected: string) => {
    setLanguage(selected as LanguageSettingType);
  };

  const saveLanguageSetting = () => {
    if (language) {
      onSaveSetting(language);
      i18n.changeLanguage(language);
    }
  };

  return (
    <Paper elevation={0} className={styles.root}>
      <List>
        <ListItem className={styles.option} alignItems="center">
          <ListItemText>
            <Typography variant="h5" color="textPrimary">
              {i18n.t('Setting.List_Menu.Language_Title')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {i18n.t('Setting.List_Menu.Language_Subtitle')}
            </Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            <DropdownMenu
              title=""
              selected={language}
              options={settingLanguageOptions}
              onChange={changeLanguageSetting}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <div className={styles.action}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          onClick={saveLanguageSetting}>
          Save Changes
        </Button>
      </div>
    </Paper>
  );
};
