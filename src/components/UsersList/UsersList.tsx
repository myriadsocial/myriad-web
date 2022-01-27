import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {List, Paper} from '@material-ui/core';
import {createStyles, makeStyles, alpha} from '@material-ui/core/styles';

import {User} from '../../interfaces/user';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {Loading} from '../atoms/Loading';
import {UsersListItem} from './UsersListItem';

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
  hasMore: boolean;
  loadNextPage: () => void;
};

export const UsersList: React.FC<UsersListProps> = ({users, hasMore, loadNextPage}) => {
  const classes = useStyles();

  return (
    <InfiniteScroll
      scrollableTarget="scrollable-users-list"
      dataLength={users.length}
      hasMore={hasMore}
      next={loadNextPage}
      loader={<Loading />}>
      <Paper style={{maxHeight: 360, overflow: 'auto'}} id="scrollable-users-list">
        <List className={classes.root}>
          {users.length === 0 ? (
            <EmptyResult emptyContent={EmptyContentEnum.USER} />
          ) : (
            users.map(user => (
              <UsersListItem
                title={user.name}
                subtitle={user.username ? `@${user.username}` : '@anonymous'}
                key={user.id}
                size={'medium'}
                avatar={user.profilePictureURL}
                url={`/profile/${user.id}`}
              />
            ))
          )}
        </List>
      </Paper>
    </InfiniteScroll>
  );
};
