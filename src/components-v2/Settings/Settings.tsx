import {ChevronRightIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  SvgIcon,
  Typography,
} from '@material-ui/core';

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
      <Typography className={styles.title} color="textPrimary">
        {selected?.title} Settings
      </Typography>

      {!selected && (
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
                  <IconButton onClick={() => setSelectedSetting(item)}>
                    <SvgIcon component={ChevronRightIcon} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}

      {selected && selected.component}
    </Paper>
  );
};
