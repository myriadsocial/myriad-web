import React from 'react';

import {Grid} from '@material-ui/core';

import {useSearchHook} from '../../hooks/use-search.hooks';
import {UsersList} from './UsersList';
import {Skeleton} from './UsersListItem.skeleton';

type UsersListContainerProps = {
  query: string;
};

export const UsersListContainer: React.FC<UsersListContainerProps> = props => {
  const {query} = props;
  const {users, hasMore, page, loading, searchUsers} = useSearchHook();

  const handleLoadNextPage = () => {
    searchUsers(query, page + 1);
  };

  if (loading && users.length === 0)
    return (
      <Grid container justify="center">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Grid>
    );

  return <UsersList loadNextPage={handleLoadNextPage} users={users} hasMore={hasMore} />;
};
