import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Link from 'next/link';

import {Badge, Button, Grid, ListItemSecondaryAction} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

import PostAvatar from '../atoms/PostHeader/avatar/post-avatar.component';
import {useStyles} from './Notifications.styles';
import {useNotificationList} from './hooks/use-notification-list.hook';

import clsx from 'clsx';
import {formatDistanceStrict, subDays} from 'date-fns';
import {Loading} from 'src/components/atoms/Loading';
import {AvatarComponent} from 'src/components/common/Avatar.component';
import {acronym} from 'src/helpers/string';
import {Notification} from 'src/interfaces/notification';

type NotificationsProps = {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
  onLoadNextPage: () => void;
  onMarkAllAsRead: () => void;
};

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 14,
      top: 36,
      width: 20,
      height: 20,
      padding: 0,
      overflow: 'hidden',
    },
  }),
)(Badge);

export const Notifications: React.FC<NotificationsProps> = props => {
  const {notifications, hasMore, onLoadNextPage, onMarkAllAsRead} = props;

  const style = useStyles();

  const list = useNotificationList(notifications);

  //TODO: this is a duplicate function on PostHeader/index.tsx
  const handleClickAvatar = (): void => {
    console.log('clicked!');
  };

  return (
    <Paper className={style.root}>
      <Grid container justifyContent="space-between" className={style.header}>
        <Typography className={style.title} color="textPrimary">
          Notifications
        </Typography>
        <Button style={{width: 'auto'}} color="primary" onClick={onMarkAllAsRead}>
          Mark all as read
        </Button>
      </Grid>
      <List className={style.list}>
        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          dataLength={notifications.length}
          hasMore={hasMore}
          next={onLoadNextPage}
          loader={<Loading />}>
          {list.map(notification => {
            return (
              <Link key={notification.id} href={notification.href} passHref>
                <ListItem
                  key={notification.id}
                  button
                  component="a"
                  ContainerComponent="div"
                  className={clsx({
                    [style.item]: true,
                    [style.unread]: !notification.read,
                  })}
                  alignItems="center">
                  <ListItemAvatar className={style.avatarItem}>
                    {notification.user === 'Account unlinked' ||
                    notification.user === 'Account linked' ? (
                      <PostAvatar
                        origin={notification.platform ?? 'myriad'}
                        name={notification.avatar ?? 'Myriad'}
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
                  <ListItemText className={style.textItem}>
                    <Typography variant="h5" color="textPrimary">
                      {notification.user}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {notification.description}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction className={style.secondaryItem}>
                    <Typography variant="body2" color="textPrimary">
                      {formatDistanceStrict(
                        subDays(new Date(notification.createdAt), 0),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </Link>
            );
          })}
        </InfiniteScroll>
      </List>
    </Paper>
  );
};
