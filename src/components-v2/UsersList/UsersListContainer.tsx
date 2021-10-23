import React from 'react';

import {useSearchHook} from '../../hooks/use-search.hooks';
import {UsersList} from './UsersList';

export const UsersListContainer: React.FC = () => {
  const {users, hasMore, nextPage} = useSearchHook();

  return <UsersList loadNextPage={nextPage} users={users} hasMore={hasMore} />;
};
