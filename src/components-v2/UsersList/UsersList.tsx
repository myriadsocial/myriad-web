import React from 'react';

import {List} from '@material-ui/core';
import {createStyles, makeStyles, alpha} from '@material-ui/core/styles';

import {acronym} from '../../helpers/string';
import {User} from '../../interfaces/user';
import {UsersListItem} from '../UsersList/UsersListItem';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
  }),
);

type UsersListProps = {
  users: User[];
};

export const UsersList: React.FC<UsersListProps> = ({users}) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {users.length &&
        users.map(user => (
          <UsersListItem
            title={user.name}
            subtitle={user.username ? `@${user.username}` : '@username'}
            key={user.id}
            size={'medium'}
            avatar={user.profilePictureURL ? user.profilePictureURL : acronym(user.name)}
            url={`/profile/${user.id}`}
          />
        ))}
    </List>
  );
};
