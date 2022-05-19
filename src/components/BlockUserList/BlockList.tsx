import React from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useBlockList, FriendRequestDetail} from '../FriendsMenu/hooks/use-friend-request.hook';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {useStyles} from './BlockList.style';

import {Empty} from 'src/components/atoms/Empty';
import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import ShowIf from 'src/components/common/show-if.component';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type Props = {
  blockList: Friend[];
  user?: User;
  onUnblock: (user: Friend) => void;
};

export const BlockListComponent: React.FC<Props> = ({blockList, user, onUnblock}) => {
  const style = useStyles();

  const confirm = useConfirm();
  const list = useBlockList(blockList, user);

  const confirmUnblock = (user: FriendRequestDetail) => () => {
    confirm({
      title: 'Unblock User?',
      description: 'You will be able to search and see post from this user.',
      confirmationText: 'Unblock Now',
      onConfirm: () => {
        onUnblock(user.friend);
      },
    });
  };

  return (
    <>
      <div className={style.root}>
        <Typography className={style.text}>
          {i18n.t('Setting.List_Menu.Blocked_Setting.Description')}
        </Typography>
      </div>

      <List style={{marginTop: 12}}>
        <ShowIf condition={list.length === 0}>
          <Empty title={i18n.t('Setting.List_Menu.Blocked_Setting.Empty_Block')} />
        </ShowIf>

        {list.map(user => (
          <ListItem key={user.id} className={style.item} alignItems="center">
            <ListItemAvatar>
              <Avatar src={user.avatar} name={user.name} size={AvatarSize.MEDIUM} />
            </ListItemAvatar>
            <ListItemText>
              <Typography className={style.name} component="span" color="textPrimary">
                {user.name}
              </Typography>
              <ListItemSecondaryAction className="hidden-button">
                <Button onClick={confirmUnblock(user)} className={style.button}>
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
