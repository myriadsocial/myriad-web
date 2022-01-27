import React from 'react';

import {useSearchHook} from '../../hooks/use-search.hooks';
import {UsersList} from './UsersList';

type UsersListContainerProps = {
  query: string;
};

export const UsersListContainer: React.FC<UsersListContainerProps> = props => {
  const {query} = props;
  const {users, hasMore, page, searchUsers} = useSearchHook();

  const handleLoadNextPage = () => {
    searchUsers(query, page + 1);
  };

  return <UsersList loadNextPage={handleLoadNextPage} users={users} hasMore={hasMore} />;
};
