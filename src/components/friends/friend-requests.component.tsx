import React, { useEffect } from 'react';

import { User } from 'next-auth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { useFriendsHook } from './use-friends-hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import ShowIf from 'src/components/common/show-if.component';
import { useFriends } from 'src/components/friends/friends.context';
import { ExtendedFriend, FriendStatus } from 'src/interfaces/friend';

type Props = {
  user: WithAdditionalParams<User>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: '#424242',
      color: '#E0E0E0',
      padding: theme.spacing(1)
    },
    header: {
      textAlign: 'center'
    },
    content: {
      padding: '0 8px',
      '&:last-child': {
        paddingBottom: theme.spacing(1.5)
      }
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
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      '&& > .MuiButton-root': {
        marginLeft: theme.spacing(2),
        '&:first-child': {
          marginLeft: 0
        }
      }
    }
  })
);

const FriendRequests = ({ user }: Props) => {
  const style = useStyles();

  const { state } = useFriends();
  const { loadRequests, toggleRequest } = useFriendsHook(user);

  useEffect(() => {
    loadRequests();
  }, []);

  const approveFriendRequest = (friend: ExtendedFriend) => {
    toggleRequest(friend, FriendStatus.APPROVED);
  };

  const rejectFriendRequest = (friend: ExtendedFriend) => {
    toggleRequest(friend, FriendStatus.REJECTED);
  };

  return (
    <Card className={style.root}>
      <CardHeader disableTypography title={<Typography variant="caption">Friend Requests</Typography>} />
      <CardContent className={style.content}>
        <ShowIf condition={state.requests.length === 0}>
          <Typography variant="h4" color="textPrimary">
            No Friend Request
          </Typography>
        </ShowIf>

        <List className={style.root}>
          {state.requests.map(request => {
            return (
              <ListItem key={request.id} className={style.item} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={request.requestor.name} src={request.requestor.profilePictureURL} />
                </ListItemAvatar>
                <ListItemText>
                  <Typography component="span" variant="h4" color="textPrimary">
                    {request.requestor.name}
                  </Typography>

                  <div className={style.action}>
                    <Button
                      onClick={() => approveFriendRequest(request)}
                      aria-label="tip-post-user"
                      color="primary"
                      variant="contained"
                      size="medium">
                      Approve
                    </Button>
                    <Button
                      onClick={() => rejectFriendRequest(request)}
                      aria-label="tip-post-user"
                      color="default"
                      variant="contained"
                      size="medium">
                      Delete
                    </Button>
                  </div>
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default FriendRequests;
