import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {Badge, Button, Grid, ListItemSecondaryAction} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

import {useStyles} from './Notifications.styles';
import {useNotificationList} from './hooks/use-notification-list.hook';

import {formatDistance, subDays} from 'date-fns';
import {Loading} from 'src/components-v2/atoms/Loading';
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
          loader={<Loading />}>
          {list.map(notification => {
            return (
              <ListItem key={notification.id} className={style.item} alignItems="center">
                <ListItemAvatar>
                  <StyledBadge badgeContent={notification.badge}>
                    <AvatarComponent className={style.avatar} src={notification.avatar}>
                      {acronym(notification.user)}
                    </AvatarComponent>
                  </StyledBadge>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h5" color="textPrimary">
                    {notification.user}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {notification.description}
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
