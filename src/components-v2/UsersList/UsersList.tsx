import React from 'react';

import {List} from '@material-ui/core';

import {acronym} from '../../helpers/string';
import {User} from '../../interfaces/user';
import {UsersListItem} from '../UsersList/UsersListItem';

type UsersListProps = {
  users: User[];
};

export const UsersList: React.FC<UsersListProps> = ({users}) => {
  return (
    <List>
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
