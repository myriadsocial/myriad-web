import React from 'react';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {acronym} from '../../helpers/string';
import SearchComponent from '../atoms/search/SearchBox';
import {useStyles} from './friend.style';

export const FriendListComponent: React.FC = () => {
  const style = useStyles();
  const handleSubmit = () => {
    return;
  };

  return (
    <div>
      <SearchComponent onSubmit={handleSubmit} placeholder={'Search friend'} />
      <List className={style.list}>
        <ListItem className={style.item} alignItems="center">
          <ListItemAvatar>
            <Avatar className={style.avatar} alt={'name'} src={''}>
              {acronym('Jenny Chang')}
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Link href={`/#`}>
              <a href={`/#`} className={style.link}>
                <Typography className={style.name} component="span" color="textPrimary">
                  Jenny Chang
                </Typography>
              </a>
            </Link>
            <Typography className={style.friend} component="p" color="textSecondary">
              1 mutual friends
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem className={style.item} alignItems="center">
          <ListItemAvatar>
            <Avatar className={style.avatar} alt={'name'} src={''}>
              {acronym('Erin Herwitz')}
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Link href={`/#`}>
              <a href={`/#`} className={style.link}>
                <Typography className={style.name} component="span" color="textPrimary">
                  Erin Herwitz
                </Typography>
              </a>
            </Link>
            <Typography className={style.friend} component="p" color="textSecondary">
              No mutual friends
            </Typography>
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );
};
