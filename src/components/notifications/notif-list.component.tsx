import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import Box from '@material-ui/core/Box';
import DividerComponent from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

import {ListHeaderComponent} from './list-header.component';

import {formatDistance, subDays} from 'date-fns';
import {AvatarComponent} from 'src/components/common/Avatar.component';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useNotifHook} from 'src/hooks/use-notif.hook';
import {RootState} from 'src/reducers';
import {NotificationState} from 'src/reducers/notification/reducer';

// eslint-disable-next-line @typescript-eslint/ban-types
type NotificationListProps = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0',
    },
    header: {
      textAlign: 'center',
    },
    content: {
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    list: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),

      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
    },
    avatar: {
      width: '50px',
      height: '50px',
    },
  }),
);

const NotificationListComponent: React.FC<NotificationListProps> = () => {
  const style = useStyles();
  const {notifications, total} = useSelector<RootState, NotificationState>(
    state => state.notificationState,
  );
  const {readNotifications} = useNotifHook();

  useEffect(() => {
    return () => {
      readNotifications();
    };
  }, []);

  return (
    <>
      <ListHeaderComponent title={`New Notification (${total})`} />
      <DividerComponent />
      <Box className={style.root}>
        <div>
          <div className={style.content}>
            <ShowIf condition={!notifications.length}>
              <Typography
                variant="h5"
                color="textPrimary"
                style={{textAlign: 'center', padding: '16px 40px'}}>
                {"You don't have any notifications, start posting!"}
              </Typography>
            </ShowIf>
            <List className={style.list}>
              {notifications.map(notification => {
                return (
                  <ListItem key={notification.id} className={style.item} alignItems="center">
                    <ListItemAvatar>
                      <AvatarComponent
                        className={style.avatar}
                        src={notification.fromUserId.profilePictureURL || ''}>
                        {acronym(notification.fromUserId.name)}
                      </AvatarComponent>
                    </ListItemAvatar>
                    <ListItemText>
                      <Typography variant="body1" color="textPrimary" style={{fontWeight: 400}}>
                        <Link href={`/${notification.from}`}>
                          <a href={`/${notification.from}`}>{notification.fromUserId.name}</a>
                        </Link>{' '}
                        {notification.message}
                      </Typography>
                      <Typography variant="body2" color="textPrimary">
                        {formatDistance(subDays(new Date(notification.createdAt), 0), new Date(), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
      </Box>
    </>
  );
};

export default NotificationListComponent;
