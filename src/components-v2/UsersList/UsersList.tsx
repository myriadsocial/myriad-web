import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {List} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, alpha} from '@material-ui/core/styles';

import {Loading} from '../../components-v2/atoms/Loading';
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
      <List className={classes.root}>
        {users.length === 0 ? (
          <div style={{marginLeft: 12}}>
            <Typography>No user found</Typography>
          </div>
        ) : (
          users.map(user => (
            <UsersListItem
              title={user.name}
              subtitle={user.username ? `@${user.username}` : '@username'}
              key={user.id}
              size={'medium'}
              avatar={user.profilePictureURL}
              url={`/profile/${user.id}`}
            />
          ))
        )}
      </List>
    </InfiniteScroll>
  );
};
