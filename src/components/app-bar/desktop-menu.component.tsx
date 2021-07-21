import React from 'react';
import {useSelector} from 'react-redux';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';

import clsx from 'clsx';
import {useNotif} from 'src/context/notif.context';
import {useLayout} from 'src/hooks/use-layout.hook';
import {SidebarTab} from 'src/interfaces/sidebar';
import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';

interface DesktopMenuProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      width: 331,
    },
    iconActive: {
      background: theme.palette.secondary.light,
    },
  }),
);

const DesktopMenuComponent: React.FC<DesktopMenuProps> = () => {
  const styles = useStyles();

  const {totalRequest} = useSelector<RootState, FriendState>(state => state.friendState);
  const {
    state: {total: totalNotif},
  } = useNotif();

  const {selectedSidebar, changeSelectedSidebar} = useLayout();

  return (
    <div className={styles.root}>
      <IconButton
        className={clsx({
          [styles.iconActive]: selectedSidebar === SidebarTab.FRIENDS,
        })}
        aria-label="friends"
        color="inherit"
        style={{margin: '0 32px'}}
        onClick={() => changeSelectedSidebar(SidebarTab.FRIENDS)}>
        <Badge badgeContent={totalRequest} color="secondary">
          <PeopleIcon />
        </Badge>
      </IconButton>
      <IconButton
        className={clsx({
          [styles.iconActive]: selectedSidebar === SidebarTab.NOTIFICATION,
        })}
        aria-label="notifications"
        color="inherit"
        style={{margin: '0 32px'}}
        onClick={() => changeSelectedSidebar(SidebarTab.NOTIFICATION)}>
        <Badge badgeContent={totalNotif} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </div>
  );
};

export default DesktopMenuComponent;
