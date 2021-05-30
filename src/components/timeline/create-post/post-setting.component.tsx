import React, { useState } from 'react';

import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';

import DialogTitle from 'src/components/common/DialogTitle.component';

type PostSettingProps = {
  userId?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      position: 'relative'
    },
    header: {
      fontSize: 16,
      fontWeight: 500,
      color: '#000000'
    }
  })
);

type SettingKey = 'everyone' | 'friend' | 'original' | 'imported';

export const PostSettingComponent: React.FC<PostSettingProps> = ({ userId }) => {
  const styles = useStyles();

  const [settings, setSetting] = useState<Record<SettingKey, boolean>>({
    everyone: true,
    friend: false,
    original: true,
    imported: true
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const settingsClicked = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const settingClosed = () => {
    setAnchorEl(null);
  };

  const handleToggle = (key: SettingKey) => () => {
    setSetting({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className={styles.root}>
      <IconButton onClick={settingsClicked} disableFocusRipple>
        <SettingsIcon />
      </IconButton>

      <Dialog open={open} aria-labelledby="no-extension-installed" maxWidth="md">
        <DialogTitle id="post-setting-title" onClose={settingClosed}>
          Post Setting
        </DialogTitle>
        <DialogContent style={{ width: 408 }}>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader className={styles.header} component="div" id="nested-list-subheader">
                Show my post to
              </ListSubheader>
            }>
            <ListItem button>
              <ListItemText primary="Everyone" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color={settings.everyone ? 'primary' : 'secondary'}
                  size="small"
                  onChange={handleToggle('everyone')}
                  checked={settings.everyone}
                  inputProps={{ 'aria-labelledby': 'switch-show-post-everyone' }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemText primary="Only my friend" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color={settings.friend ? 'primary' : 'secondary'}
                  size="small"
                  onChange={handleToggle('friend')}
                  checked={settings.friend}
                  inputProps={{ 'aria-labelledby': 'switch-show-post-frien' }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemText primary="Show to.." />
            </ListItem>
          </List>

          <Divider />

          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader className={styles.header} component="div" id="nested-list-subheader">
                Tipping allowed
              </ListSubheader>
            }>
            <ListItem button>
              <ListItemText primary="My original post" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color={settings.original ? 'primary' : 'secondary'}
                  size="small"
                  onChange={handleToggle('original')}
                  checked={settings.original}
                  inputProps={{ 'aria-labelledby': 'switch-tipping-originnal' }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemText primary="Imported post" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color={settings.imported ? 'primary' : 'secondary'}
                  size="small"
                  onChange={handleToggle('imported')}
                  checked={settings.imported}
                  inputProps={{ 'aria-labelledby': 'switch-tipping-imported' }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={settingClosed}
            disableRipple={true}
            disableFocusRipple={true}
            variant="contained"
            color="primary"
            size="medium"
            style={{ margin: '0 auto' }}>
            Save settings
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
