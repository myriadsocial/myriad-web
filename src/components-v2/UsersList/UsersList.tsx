import React from 'react';

import {List} from '@material-ui/core';

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
            key={user.id}
            avatar={user.profilePictureURL}
            url={`/profile/${user.id}`}
          />
        ))}
    </List>
  );
};
