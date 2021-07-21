import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import {ListHeaderComponent} from './list-header.component';
import {ListSubHeaderComponent} from './list-sub-header.component';

import {ToggleCollapseButton} from 'src/components/common/collapse-button.component';
import ShowIf from 'src/components/common/show-if.component';
import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

type FriendsListProps = {
  showOnlineStatus?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0',
    },
    header: {
      marginBottom: theme.spacing(2),
      display: 'flex',
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
    online: {
      color: '#06960C',
    },
  }),
);

const FriendsListComponent: React.FC<FriendsListProps> = ({showOnlineStatus = false}) => {
  const style = useStyles();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {friends, totalFriend} = useSelector<RootState, FriendState>(state => state.friendState);

  const [openOnlineFriends, setOpenOnlineFriends] = useState(true);
  const [openOtherFriends] = useState(false);

  const toggleOnlineFriends = () => {
    setOpenOnlineFriends(!openOnlineFriends);
  };

  if (!user) return null;

  return (
    <Box className={style.root}>
      <ListHeaderComponent title={`Friends (${totalFriend})`} />

      <div>
        <div className={style.header}>
          <ListSubHeaderComponent title={`Online (${totalFriend})`} />
          {friends.length > 0 && <ToggleCollapseButton onClick={toggleOnlineFriends} />}
        </div>
        <Collapse in={openOnlineFriends} timeout="auto" unmountOnExit>
          <div className={style.content}>
            <ShowIf condition={friends.length === 0}>
              <Typography
                variant="h4"
                color="textPrimary"
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  textAlign: 'center',
                  padding: '16px 0',
                  color: '#B1AEB7',
                }}>
                You don't have any Myriad friends yet. Search for people or tell your friends about
                Myriad!
              </Typography>
            </ShowIf>

            <List className={style.list}>
              {friends.map(request => {
                return (
                  <div key={request.id}>
                    {user.id !== request.requestorId && (
                      <ListItem className={style.item} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt={request.requestor.name}
                            src={request.requestor.profilePictureURL}
                          />
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography
                            component="span"
                            variant="h4"
                            color="textPrimary"
                            style={{fontSize: 16}}>
                            {request.requestor.name}
                          </Typography>
                        </ListItemText>
                        {showOnlineStatus && (
                          <ListItemSecondaryAction>
                            <FiberManualRecordIcon className={style.online} />
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    )}

                    {user.id !== request.friendId && (
                      <ListItem className={style.item} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt={request.friend.name}
                            src={request.friend.profilePictureURL}
                          />
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography
                            component="span"
                            variant="h4"
                            color="textPrimary"
                            style={{fontSize: 16}}>
                            {request.friend.name}
                          </Typography>
                        </ListItemText>
                        {showOnlineStatus && (
                          <ListItemSecondaryAction>
                            <FiberManualRecordIcon className={style.online} />
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    )}
                  </div>
                );
              })}
            </List>
          </div>
        </Collapse>
      </div>

      <div>
        <div className={style.header}>
          <ListSubHeaderComponent title={`Others (0)`} />
          {openOtherFriends && <ToggleCollapseButton onClick={console.log} />}
        </div>
      </div>
    </Box>
  );
};

export default FriendsListComponent;
