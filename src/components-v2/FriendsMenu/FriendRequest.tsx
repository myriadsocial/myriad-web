import {XCircleIcon} from '@heroicons/react/outline';
import {CheckCircleIcon} from '@heroicons/react/outline';

import React from 'react';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {acronym} from '../../helpers/string';
import {useStyles} from './friend.style';
import {useFriendRequestList} from './hooks/use-friend-request.hook';

import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

type FriendRequestProps = {
  user?: User;
  requests: Friend[];
  onAcceptRequest: (request: Friend) => void;
  onDeclineRequest: (request: Friend) => void;
};

export const FriendRequestComponent: React.FC<FriendRequestProps> = props => {
  const {user, requests, onAcceptRequest, onDeclineRequest} = props;
  const style = useStyles();

  const list = useFriendRequestList(requests, user);

  return (
    <div>
      <List>
        {list.map(request => (
          <ListItem className={style.item} alignItems="center" key={request.id}>
            <ListItemAvatar>
              <Avatar className={style.avatar} alt={request.name} src={request.avatar}>
                {acronym(request.name)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Link href={`/#`}>
                <a href={`/#`} className={style.link}>
                  <Typography className={style.name} component="span" color="textPrimary">
                    {request.name}
                  </Typography>
                </a>
              </Link>
              <Typography className={style.friend} component="p" color="textSecondary">
                1 mutual friends
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Button
                onClick={() => onAcceptRequest(request.friend)}
                className={style.button}
                color="primary"
                variant="text"
                startIcon={
                  <SvgIcon
                    classes={{root: style.fill}}
                    component={CheckCircleIcon}
                    viewBox="0 0 24 24"
                  />
                }>
                <Typography className={style.buttonText}>Accept</Typography>
              </Button>
              <Button
                onClick={() => onDeclineRequest(request.friend)}
                className={`${style.button} ${style.error}`}
                color="inherit"
                variant="text"
                startIcon={
                  <SvgIcon
                    classes={{root: style.fill}}
                    component={XCircleIcon}
                    viewBox="0 0 24 24"
                  />
                }>
                <Typography className={style.buttonText}>Decline</Typography>
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
