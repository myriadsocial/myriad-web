import React, { useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import DividerComponent from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { ListHeaderComponent } from './list-header.component';

import ShowIf from 'src/components/common/show-if.component';
import { useNotif } from 'src/context/notif.context';
import { useNotifHook } from 'src/hooks/use-notif.hook';
import { User } from 'src/interfaces/user';

type Props = {
  user: User;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0'
    },
    header: {
      textAlign: 'center'
    },
    content: {
      '&:last-child': {
        paddingBottom: 0
      }
    },
    list: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2)
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),

      '& .MuiListItemText-root': {
        alignSelf: 'center'
      }
    },
    avatar: {
      width: '50px',
      height: '50px'
    }
  })
);

const Notification = ({ user }: Props) => {
  const style = useStyles();
  // const [notif, setNotif] = useState(3);
  const { state } = useNotif();
  const { loadNotifications } = useNotifHook(user);

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <>
      <ListHeaderComponent title={`New Notification (${state.notifications.length})`} />
      <DividerComponent />
      <Box className={style.root}>
        <div>
          <div className={style.content}>
            <ShowIf condition={state.notifications.length === 0}>
              <Typography variant="h4" color="textPrimary" style={{ textAlign: 'center', padding: '16px 0' }}>
                No Notification
              </Typography>
            </ShowIf>

            <List className={style.list}>
              {state.notifications.map(notif => {
                return (
                  <ListItem key={notif.id} className={style.item} alignItems="center">
                    <ListItemAvatar>
                      <Avatar className={style.avatar} src={notif.fromUserId.profilePictureURL || ''}>
                        {'JW'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>
                      <Typography variant="h6" color="textPrimary">
                        {notif.fromUserId.name} {notif.message}
                      </Typography>
                      <Typography variant="body2" color="textPrimary">
                        {'a few second ago'}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                );
              })}
              {/* <ListItem className={style.item} alignItems="center">
                <ListItemAvatar>
                  <Avatar className={style.avatar} src={''}>
                    {'JW'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h6" color="textPrimary" style={{ color: '#fff' }}>
                    {'Johny Walker'} {'commented on your post from twitter'}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" style={{ color: '#fff' }}>
                    {'a few second ago'}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem className={style.item} alignItems="center">
                <ListItemAvatar>
                  <Avatar className={style.avatar} src={''}>
                    {'JW'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h6" color="textPrimary" style={{ color: '#fff' }}>
                    {'Johny Walker'} {'commented on your post from twitter'}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" style={{ color: '#fff' }}>
                    {'a few second ago'}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem className={style.item} alignItems="center">
                <ListItemAvatar>
                  <Avatar className={style.avatar} src={''}>
                    {'JW'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h6" color="textPrimary" style={{ color: '#fff' }}>
                    {'Johny Walker'} {'commented on your post from twitter'}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" style={{ color: '#fff' }}>
                    {'1 day ago'}
                  </Typography>
                </ListItemText>
              </ListItem> */}
            </List>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Notification;
