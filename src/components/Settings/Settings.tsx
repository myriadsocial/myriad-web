import {ChevronRightIcon} from '@heroicons/react/outline';

import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  Paper,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import ShowIf from '../common/show-if.component';
import {useStyles} from './Settings.styles';
import {SettingsOption, useSettingList, SettingsType} from './hooks/use-setting-list.hook';

import {UserSettings} from 'src/interfaces/setting';
import i18n from 'src/locale';

type SettingsProps = {
  selectedType?: SettingsType;
  value: UserSettings;
  onChange: (section: SettingsType) => void;
  onSaveSetting: () => void;
};

export const Settings: React.FC<SettingsProps> = props => {
  const {selectedType, value, onChange} = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const styles = useStyles();
  const settings = useSettingList();

  const selected = settings.find(item => item.id === selectedType);

  const selectSettings = (setting: SettingsOption<SettingsType>) => () => {
    onChange(setting.id);
  };

  return (
    <Paper className={styles.root}>
      {!selected && (
        <>
          <Typography className={styles.title} color="textPrimary">
            {i18n.t('Setting.Header')}
          </Typography>
          <List>
            {settings.map(item => {
              return (
                <ListItem
                  key={item.id}
                  button
                  onClick={selectSettings(item)}
                  disabled={item.id == 'version'}
                  className={styles.option}
                  alignItems="center">
                  <ListItemText>
                    <Typography variant="h5" color="textPrimary" className={styles.primary}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className={styles.secondary}>
                      {item.subtitle}
                    </Typography>
                    {item.id === 'version' && isMobile && (
                      <div className={styles.valueVersion}>
                        <Typography>{value.version}</Typography>
                      </div>
                    )}
                  </ListItemText>
                  {item.id === 'version' && !isMobile && (
                    <div className={styles.valueVersion}>
                      <Typography>{value.version}</Typography>
                    </div>
                  )}

                  {item.id !== 'version' && (
                    <div className="hidden-button">
                      <SvgIcon component={ChevronRightIcon} />
                    </div>
                  )}
                </ListItem>
              );
            })}
          </List>
        </>
      )}

      {selected && (
        <ShowIf condition={selected.id !== 'version' && selected.id !== 'about'}>
          <Typography className={styles.subtitle} color="textPrimary">
            {selected?.title}
          </Typography>
          <div>{selected.component}</div>
        </ShowIf>
      )}
    </Paper>
  );
};
