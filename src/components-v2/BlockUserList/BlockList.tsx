import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {Friend} from '../../interfaces/friend';
import {useFriendRequestList} from '../FriendsMenu/hooks/use-friend-request.hook';
import {useStyles} from './blocklist.style';

import {acronym} from 'src/helpers/string';
import {User} from 'src/interfaces/user';

type Props = {
  blockList: Friend[];
  user?: User;
  onUnblock: (user: Friend) => void;
};

export const BlockListComponent: React.FC<Props> = ({blockList, user, onUnblock}) => {
  const style = useStyles();
  const list = useFriendRequestList(blockList, user);

  return (
    <>
      <div className={style.root}>
        <Typography className={style.text}>
          By blocking someone, they can no longer see things you post on your timeline, tag you, and
          start a conversation with you, or add you as a friend.
        </Typography>
      </div>
      <List>
        {list.map(user => (
          <ListItem key={user.id} className={style.item} alignItems="center">
            <ListItemAvatar>
              <Avatar className={style.avatar} alt={'name'} src={user.avatar}>
                {acronym(user.name)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Typography className={style.name} component="span" color="textPrimary">
                {user.name}
              </Typography>
              <ListItemSecondaryAction className="hidden-button">
                <Button onClick={() => onUnblock(user.friend)} className={style.button}>
                  Unblock
                </Button>
              </ListItemSecondaryAction>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
};
