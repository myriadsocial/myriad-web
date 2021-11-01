import React, {useState} from 'react';

import {Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {
  useFriendRequestList,
  FriendRequestDetail,
} from '../FriendsMenu/hooks/use-friend-request.hook';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {useStyles} from './blocklist.style';

import {Empty} from 'src/components-v2/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

type Props = {
  blockList: Friend[];
  user?: User;
  onUnblock: (user: Friend) => void;
};

export const BlockListComponent: React.FC<Props> = ({blockList, user, onUnblock}) => {
  const style = useStyles();
  const list = useFriendRequestList(blockList, user);

  const [unblockedUser, setUnblockUser] = useState<Friend | undefined>();

  const handleUnblock = (user: FriendRequestDetail) => () => {
    setUnblockUser(user.friend);
  };

  const cancelUblockUser = () => {
    setUnblockUser(undefined);
  };

  const confirmUnblockUser = () => {
    if (unblockedUser) {
      onUnblock(unblockedUser);
    }

    setUnblockUser(undefined);
  };

  return (
    <>
      <div className={style.root}>
        <Typography className={style.text}>
          By blocking someone, they can no longer see things you post on your timeline, tag you, and
          start a conversation with you, or add you as a friend.
        </Typography>
      </div>

      <List style={{marginTop: 12}}>
        <ShowIf condition={list.length === 0}>
          <Empty title="You have no blocked user" />
        </ShowIf>

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
                <Button onClick={handleUnblock(user)} className={style.button}>
                  Unblock
                </Button>
              </ListItemSecondaryAction>
            </ListItemText>
          </ListItem>
        ))}
      </List>

      <PromptComponent
        onCancel={cancelUblockUser}
        open={Boolean(unblockedUser)}
        icon="warning"
        title="Unblock User?"
        subtitle="You will be able to search and see post from this user">
        <Grid container justifyContent="space-between">
          <Button size="small" variant="outlined" color="secondary" onClick={cancelUblockUser}>
            Cancel
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={confirmUnblockUser}>
            Unblock Now
          </Button>
        </Grid>
      </PromptComponent>
    </>
  );
};
