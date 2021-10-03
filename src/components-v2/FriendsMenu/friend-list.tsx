import React from 'react';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {acronym} from '../../helpers/string';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu/';
import SearchComponent from '../atoms/Search/SearchBox';
import {friendFilterOptions} from './default';
import {FriendListProps} from './default';
import {useStyles} from './friend.style';

export const FriendListComponent: React.FC<FriendListProps> = props => {
  const {background = false, friends} = props;
  const style = useStyles();

  const handleFilterSelected = (selected: string) => {
    // code
  };

  const handleSubmit = () => {
    return;
  };

  return (
    <div>
      <FilterDropdownMenu
        title="Filter by"
        options={friendFilterOptions}
        onChange={handleFilterSelected}
      />
      <SearchComponent onSubmit={handleSubmit} placeholder={'Search friend'} />
      <List className={style.list}>
        {friends &&
          friends.map(friend => (
            <ListItem
              key={friend.id}
              classes={{root: background ? style.backgroundEven : ''}}
              className={style.item}
              alignItems="center">
              <ListItemAvatar>
                <Avatar
                  className={style.avatar}
                  alt={'name'}
                  src={friend.requestee.profilePictureURL}>
                  {acronym(friend.requestee.name)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <Link href={`/#`}>
                  <a href={`/#`} className={style.link}>
                    <Typography className={style.name} component="span" color="textPrimary">
                      {friend.requestee.name}
                    </Typography>
                  </a>
                </Link>
                <Typography className={style.friend} component="p" color="textSecondary">
                  1 mutual friends
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
      </List>
    </div>
  );
};
