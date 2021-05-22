import React, { useEffect } from 'react';

import { User } from 'next-auth';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { useFriendsHook } from './use-friends-hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import ShowIf from 'src/components/common/show-if.component';
import { useFriends } from 'src/components/friends/friends.context';

type Props = {
  user: WithAdditionalParams<User>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1)
    },
    item: {
      border: '1px solid',
      borderColor: '#A942E9',
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    action: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      position: 'relative',
      right: 'unset',
      marginLeft: 66,
      padding: theme.spacing(1),
      '&& > .MuiButton-root': {
        marginLeft: theme.spacing(2)
      }
    }
  })
);

const Friends = ({ user }: Props) => {
  const style = useStyles();

  const { state } = useFriends();
  const { loadFriends } = useFriendsHook(user);

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div>
      <Toolbar>
        <Typography variant="h4">Friends</Typography>
      </Toolbar>

      <ShowIf condition={state.friends.length === 0}>
        <Typography variant="h4" color="textPrimary">
          No Friends
        </Typography>
      </ShowIf>

      <List className={style.root}>
        {state.friends.map(request => {
          return (
            <ListItem className={style.item} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={request.requestor.name} src={request.requestor.profilePictureURL} />
              </ListItemAvatar>
              <ListItemText>
                <Typography component="span" variant="h4" color="textPrimary">
                  {request.requestor.name}
                </Typography>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Friends;
