import React from 'react';

import {useMyriadUser} from '../../hooks/use-myriad-users.hooks';
import {UsersList} from './UsersList';

export const UsersListContainer: React.FC = () => {
  const {users} = useMyriadUser();

  //TODO: add loading state
  if (!users.length) return <p>loading</p>;

  return <UsersList users={users} />;
};
