import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {List} from '@material-ui/core';
import {createStyles, makeStyles, alpha} from '@material-ui/core/styles';

import {Loading} from '../../components-v2/atoms/Loading';
import ShowIf from '../../components/common/show-if.component';
import {User} from '../../interfaces/user';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
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
      <ShowIf condition={users.length === 0}>
        <EmptyResult emptyContent={EmptyContentEnum.USER} />
      </ShowIf>

      <ShowIf condition={users.length > 0}>
        <List className={classes.root}>
          {users.map(user => (
            <UsersListItem
              title={user.name}
              subtitle={user.username ? `@${user.username}` : '@anonymous'}
              key={user.id}
              size={'medium'}
              avatar={user.profilePictureURL}
              url={`/profile/${user.id}`}
            />
          ))}
        </List>
      </ShowIf>
    </InfiniteScroll>
  );
};
