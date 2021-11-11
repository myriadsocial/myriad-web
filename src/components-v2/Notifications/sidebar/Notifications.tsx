import React from 'react';

import Link from 'next/link';

import {Badge, Button, Grid, ListItemSecondaryAction} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {withStyles, createStyles} from '@material-ui/core/styles';

import PostAvatar from '../../atoms/PostHeader/avatar/post-avatar.component';
import {useNotificationList} from '../hooks/use-notification-list.hook';
import {useStyles} from './Notifications.styles';

import clsx from 'clsx';
import {formatDistance, subDays} from 'date-fns';
import {AvatarComponent} from 'src/components/common/Avatar.component';
import {acronym} from 'src/helpers/string';
import {Notification} from 'src/interfaces/notification';

type NotificationsProps = {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
};

const StyledBadge = withStyles(() =>
  createStyles({
    badge: {
      right: 5,
      top: 33,
      width: 20,
      height: 20,
      padding: 0,
      overflow: 'hidden',
    },
  }),
)(Badge);

export const MiniNotifications: React.FC<NotificationsProps> = props => {
  const {notifications, onMarkAllAsRead} = props;

  const style = useStyles();

  const list = useNotificationList(notifications);

  //TODO: this is a duplicate function on PostHeader/index.tsx
  const handleClickAvatar = (): void => {
    console.log('clicked!');
  };

  return (
    <Paper className={style.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography className={style.title} color="textPrimary">
          Notifications
        </Typography>
        <Button className={style.button} color="primary" onClick={onMarkAllAsRead}>
          Mark all as read
        </Button>
      </Grid>
      <List className={style.list}>
        {list.map(notification => {
          return (
            <Link key={notification.id} href={notification.href} passHref>
              <ListItem
                button
                component="a"
                ContainerComponent="div"
                key={notification.id}
                className={clsx({
                  [style.item]: true,
                  [style.unread]: !notification.read,
                })}
                alignItems="center">
                <ListItemAvatar>
                  {notification.user === 'Account disconnected' ||
                  notification.user === 'Account connected' ? (
                    <PostAvatar
                      origin={notification.platform ?? 'myriad'}
                      name={notification.user}
                      onClick={handleClickAvatar}
                    />
                  ) : (
                    <StyledBadge badgeContent={notification.badge}>
                      <AvatarComponent className={style.avatar} src={notification.avatar}>
                        {notification.avatar
                          ? acronym(notification.avatar)
                          : acronym(notification.user)}
                      </AvatarComponent>
                    </StyledBadge>
                  )}
                </ListItemAvatar>
                <ListItemText>
                  <Typography className={style.textMain} color="textPrimary">
                    {notification.user}
                  </Typography>
                  <Typography
                    style={{maxWidth: '140px'}}
                    className={style.textSecondary}
                    color="textSecondary">
                    {notification.description}
                  </Typography>
                </ListItemText>
                <ListItemSecondaryAction classes={{root: style.date}}>
                  <Typography className={style.textSecondary} color="textSecondary">
                    {formatDistance(subDays(new Date(notification.createdAt), 0), new Date(), {
                      addSuffix: true,
                    })}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
          );
        })}
      </List>
      <div className={style.footer}>
        <Link href="/notification">
          <a href={`/notification`} className={style.link}>
            <Typography style={{fontWeight: 'bold'}}>View all notifications</Typography>
          </a>
        </Link>
      </div>
    </Paper>
  );
};
