import {ChevronRightIcon} from '@heroicons/react/outline';

import React from 'react';

import {List, ListItem, ListItemText, Paper, SvgIcon, Typography} from '@material-ui/core';

import ShowIf from '../../components/common/show-if.component';
import {useStyles} from './Settings.styles';
import {SettingsOption, useSettingList, SettingsType} from './hooks/use-setting-list.hook';

import {UserSettings} from 'src/interfaces/setting';

type SettingsProps = {
  selectedType?: SettingsType;
  value: UserSettings;
  onChange: (section: SettingsType) => void;
  onSaveSetting: () => void;
};

export const Settings: React.FC<SettingsProps> = props => {
  const {selectedType, value, onChange} = props;

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
            Settings
          </Typography>
          <List>
            {settings.map(item => {
              return (
                <ListItem
                  key={item.id}
                  button
                  onClick={selectSettings(item)}
                  className={styles.option}
                  alignItems="center">
                  <ListItemText>
                    <Typography variant="h5" color="textPrimary">
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {item.subtitle}
                    </Typography>
                  </ListItemText>
                  {item.id === 'version' && (
                    <div
                      style={{
                        display: 'flex',
                        paddingRight: 31,
                        fontWeight: 300,
                        fontStyle: 'italic',
                        fontSize: 14,
                        color: '#988E8E',
                      }}>
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
            {selected?.title} Settings
          </Typography>
          <div>{selected.component}</div>
        </ShowIf>
      )}
    </Paper>
  );
};
