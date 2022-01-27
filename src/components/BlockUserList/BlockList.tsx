import React, {useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useBlockList, FriendRequestDetail} from '../FriendsMenu/hooks/use-friend-request.hook';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {useStyles} from './blocklist.style';

import {Empty} from 'src/components/atoms/Empty';
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
  const list = useBlockList(blockList, user);

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
          When you blocked someone, that person won’t be able to view your profile and post, add you
          as a friend, tag you or message you and you won’t see post or notification from them.
        </Typography>
      </div>

      <List style={{marginTop: 12}}>
        <ShowIf condition={list.length === 0}>
          <Empty title="You haven't blocked anyone yet." />
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
        <div className={style.flex}>
          <Button
            className={style.m1}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={cancelUblockUser}>
            Cancel
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={confirmUnblockUser}>
            Unblock Now
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
