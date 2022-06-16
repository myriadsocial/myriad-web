import React from 'react';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import {DropdownMenu} from '../atoms/DropdownMenu';
import {useStyles} from './Settings.styles';
import {settingLanguageOptions} from './default';

import ShowIf from 'components/common/show-if.component';
import {LanguageSettingType} from 'src/interfaces/setting';
import i18n from 'src/locale';

type LanguageSettingsProps = {
  value: LanguageSettingType;
  onSaveSetting: (payload: LanguageSettingType) => void;
};

export const LanguageSetting: React.FC<LanguageSettingsProps> = props => {
  const {value, onSaveSetting} = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [language, setLanguage] = React.useState<LanguageSettingType>(value);

  React.useEffect(() => {
    setLanguage(value);
  }, [value]);

  React.useEffect(() => {
    const selectedLang = localStorage.getItem('i18nextLng') as LanguageSettingType | null;
    if (selectedLang) {
      setLanguage(selectedLang);
    }
  }, []);

  const styles = useStyles();

  const saveLanguageSetting = () => {
    if (language) {
      onSaveSetting(language);
      i18n.changeLanguage(language);
    }
  };

  return (
    <Paper elevation={0} className={styles.root}>
      <ShowIf condition={!isMobile}>
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
              <DropdownMenu<LanguageSettingType>
                title=""
                selected={language}
                options={settingLanguageOptions}
                onChange={setLanguage}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </ShowIf>
      <ShowIf condition={isMobile}>
        <Typography className={styles.subtitleLang} color="textSecondary">
          {i18n.t('Setting.List_Menu.Language_Subtitle')}
        </Typography>
        <List>
          <ListItem className={styles.option} alignItems="center" style={{marginLeft: 10}}>
            <DropdownMenu<LanguageSettingType>
              title=""
              selected={language}
              options={settingLanguageOptions}
              onChange={setLanguage}
              useIconOnMobile={false}
            />
          </ListItem>
        </List>
      </ShowIf>
      <div className={styles.action}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          onClick={saveLanguageSetting}>
          {i18n.t('Setting.List_Menu.Language_Setting.Confirm')}
        </Button>
      </div>
    </Paper>
  );
};
