import {ChevronRightIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {List, ListItem, ListItemText, Paper, SvgIcon, Typography} from '@material-ui/core';

import ShowIf from '../../components/common/show-if.component';
import {useStyles} from './Settings.styles';
import {SettingsOption, useSettingList} from './hooks/use-setting-list.hook';

type SettingsProps = {
  onSaveSetting: () => void;
};

export const Settings: React.FC<SettingsProps> = () => {
  const styles = useStyles();
  const settings = useSettingList();

  const [selected, setSelectedSetting] = useState<SettingsOption | null>(null);

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
                  onClick={() => setSelectedSetting(item)}
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
                      <Typography>v1.0.0</Typography>
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
