import React from 'react';
import {useSelector} from 'react-redux';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';

import clsx from 'clsx';
import {useLayout} from 'src/hooks/use-layout.hook';
import {SidebarTab} from 'src/interfaces/sidebar';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {RootState} from 'src/reducers';
import {NotificationState} from 'src/reducers/notification/reducer';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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

  const {totalItemCount: totalFriendRequest} = useSelector<RootState, ListMeta>(
    state => state.friendRequestState.meta,
  );
  const {total} = useSelector<RootState, NotificationState>(state => state.notificationState);

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
        <Badge badgeContent={totalFriendRequest} color="secondary">
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
        <Badge badgeContent={total} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </div>
  );
};

export default DesktopMenuComponent;
