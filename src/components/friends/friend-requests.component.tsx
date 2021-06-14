import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { ToggleCollapseButton } from 'src/components/common/collapse-button.component';
import ShowIf from 'src/components/common/show-if.component';
import { useFriends } from 'src/context/friends.context';
import { useFriendsHook } from 'src/hooks/use-friends-hook';
import { ExtendedFriend, FriendStatus } from 'src/interfaces/friend';
import { User } from 'src/interfaces/user';

type Props = {
  user: User | null;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0'
    },
    header: {
      marginBottom: theme.spacing(2),
      display: 'flex'
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
      paddingRight: theme.spacing(0.5)
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
    },
    more: {
      display: 'block',
      fontSize: 16,
      margin: '0 auto',
      color: '#000000',
      marginBottom: 16
    }
  })
);

const FriendRequests = ({ user }: Props) => {
  const style = useStyles();

  const { state } = useFriends();
  const { loadRequests, toggleRequest } = useFriendsHook(user);
  const [openFriends, setOpenFriends] = useState(true);

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
    <Box className={style.root}>
      <div className={style.header}>
        <Typography variant="caption" component="div" style={{ fontWeight: 500, fontSize: 14, lineHeight: '36px' }}>
          Friend Requests ({state.requests.length})
        </Typography>

        <ToggleCollapseButton onClick={setOpenFriends} />
      </div>
      <div className={style.content}>
        <Collapse in={openFriends} timeout="auto" unmountOnExit>
          <ShowIf condition={state.requests.length === 0}>
            <Typography
              variant="h4"
              color="textPrimary"
              style={{ fontWeight: 500, textAlign: 'center', fontSize: 14, color: '#B1AEB7', padding: '16px 0' }}>
              You don't have any friend request
            </Typography>
          </ShowIf>

          <List className={style.list}>
            {state.requests.map(request => {
              return (
                <ListItem key={request.id} className={style.item} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={request.requestor.name} src={request.requestor.profilePictureURL} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography component="span" variant="h4" color="textPrimary" style={{ color: '#000000', fontSize: 16 }}>
                      {request.requestor.name}
                    </Typography>

                    <div className={style.action}>
                      <Button
                        onClick={() => rejectFriendRequest(request)}
                        aria-label="tip-post-user"
                        color="default"
                        variant="contained"
                        size="medium">
                        Ignore
                      </Button>
                      <Button
                        onClick={() => approveFriendRequest(request)}
                        aria-label="tip-post-user"
                        color="primary"
                        variant="contained"
                        size="medium">
                        Accept
                      </Button>
                    </div>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>

          <ShowIf condition={state.totalFriendRequests > state.requests.length}>
            <Link
              className={style.more}
              component="button"
              onClick={() => {
                console.info("I'm a button.");
              }}>
              (show all request)
            </Link>
          </ShowIf>
        </Collapse>
      </div>
    </Box>
  );
};

export default FriendRequests;
