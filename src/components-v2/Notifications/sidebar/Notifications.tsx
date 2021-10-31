import React from 'react';

import Link from 'next/link';

import {Badge, Button, Grid, ListItemSecondaryAction} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

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

const StyledBadge = withStyles((theme: Theme) =>
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

  return (
    <Paper className={style.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography className={style.title} color="textPrimary">
          Notifications
        </Typography>
        <Button
          style={{width: 'auto', fontSize: '12px', padding: 0}}
          color="primary"
          onClick={onMarkAllAsRead}>
          Mark all as read
        </Button>
      </Grid>
      <List className={style.list}>
        {list.map(notification => {
          return (
            <ListItem
              key={notification.id}
              className={clsx({
                [style.item]: true,
                [style.unread]: !notification.read,
              })}
              alignItems="center">
              <ListItemAvatar>
                <StyledBadge badgeContent={notification.badge}>
                  <AvatarComponent className={style.avatar} src={notification.avatar}>
                    {acronym(notification.user)}
                  </AvatarComponent>
                </StyledBadge>
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
          );
        })}
      </List>
      <div className={style.footer}>
        <Link href="/notification">
          <a href={`/notification`} className={style.link}>
            <Typography>View all notifications</Typography>
          </a>
        </Link>
      </div>
    </Paper>
  );
};
