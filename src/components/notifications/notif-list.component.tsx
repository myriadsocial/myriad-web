import React, {useEffect} from 'react';

import Avatar from '@material-ui/core/Avatar';
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
import ShowIf from 'src/components/common/show-if.component';
import {useNotif} from 'src/context/notif.context';
import {acronym} from 'src/helpers/string';
import {useNotifHook} from 'src/hooks/use-notif.hook';

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

const NotificationListComponent: React.FC<NotificationListProps> = props => {
  const style = useStyles();
  const {state} = useNotif();
  const {loadNotifications} = useNotifHook();

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <>
      <ListHeaderComponent title={`New Notification (${state.total})`} />
      <DividerComponent />
      <Box className={style.root}>
        <div>
          <div className={style.content}>
            <ShowIf condition={state.total == 0}>
              <Typography
                variant="h5"
                color="textPrimary"
                style={{textAlign: 'center', padding: '16px 40px'}}>
                You don't have any notifications, start posting!
              </Typography>
            </ShowIf>
            <List className={style.list}>
              {state.notifications.map(notification => {
                return (
                  <ListItem key={notification.id} className={style.item} alignItems="center">
                    <ListItemAvatar>
                      <Avatar className={style.avatar} src={notification.from || ''}>
                        {acronym(notification.from ?? '')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>
                      <Typography variant="body1" color="textPrimary" style={{fontWeight: 400}}>
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
