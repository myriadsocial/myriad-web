import React from 'react';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';

import clsx from 'clsx';
import { useFriends } from 'src/context/friends.context';
import { useNotif } from 'src/context/notif.context';
import { useLayout } from 'src/hooks/use-layout.hook';
import { SidebarTab } from 'src/interfaces/sidebar';

interface DesktopMenuProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      width: 331
    },
    iconActive: {
      background: theme.palette.secondary.light
    }
  })
);

const DesktopMenuComponent: React.FC<DesktopMenuProps> = () => {
  const styles = useStyles();

  const {
    state: { totalFriendRequests }
  } = useFriends();
  const {
    state: { total: totalNotif }
  } = useNotif();

  const { selectedSidebar, changeSelectedSidebar } = useLayout();

  return (
    <div className={styles.root}>
      <IconButton
        className={clsx({
          [styles.iconActive]: selectedSidebar === SidebarTab.FRIENDS
        })}
        aria-label="friends"
        color="inherit"
        style={{ margin: '0 32px' }}
        onClick={() => changeSelectedSidebar(SidebarTab.FRIENDS)}>
        <Badge badgeContent={totalFriendRequests} color="secondary">
          <PeopleIcon />
        </Badge>
      </IconButton>
      <IconButton
        className={clsx({
          [styles.iconActive]: selectedSidebar === SidebarTab.NOTIFICATION
        })}
        aria-label="notifications"
        color="inherit"
        style={{ margin: '0 32px' }}
        onClick={() => changeSelectedSidebar(SidebarTab.NOTIFICATION)}>
        <Badge badgeContent={totalNotif} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </div>
  );
};

export default DesktopMenuComponent;
