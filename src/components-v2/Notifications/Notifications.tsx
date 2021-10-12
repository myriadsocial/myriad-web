import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lottie from 'react-lottie';

import Link from 'next/link';

import {Button, Grid, ListItemSecondaryAction} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LoadingAnimation from '../../lottie/loading.json';
import {useStyles} from './Notifications.styles';

import {formatDistance, subDays} from 'date-fns';
import {AvatarComponent} from 'src/components/common/Avatar.component';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {Notification, NotificationType} from 'src/interfaces/notification';

type NotificationsProps = {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
  onLoadNextPage: () => void;
  onMarkAllAsRead: () => void;
};

export const Notifications: React.FC<NotificationsProps> = props => {
  const {notifications, hasMore, onLoadNextPage, onMarkAllAsRead} = props;

  const style = useStyles();

  const lottieLoading = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Paper className={style.root}>
      <Grid container justifyContent="space-between">
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
          loader={<Lottie options={lottieLoading} height={50} width={50} />}>
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
                  <Typography variant="h5" color="textPrimary">
                    <ShowIf
                      condition={[
                        NotificationType.FRIEND_REQUEST,
                        NotificationType.FRIEND_ACCEPT,
                        NotificationType.POST_COMMENT,
                      ].includes(notification.type)}>
                      {notification.fromUserId.name}
                    </ShowIf>
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <Link href={`/${notification.from}`}>
                      <a href={`/${notification.from}`} className={style.link}>
                        {notification.fromUserId.name}
                      </a>
                    </Link>{' '}
                    {notification.message}
                  </Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  <Typography variant="body2" color="textPrimary">
                    {formatDistance(subDays(new Date(notification.createdAt), 0), new Date(), {
                      addSuffix: true,
                    })}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </InfiniteScroll>
      </List>
    </Paper>
  );
};
