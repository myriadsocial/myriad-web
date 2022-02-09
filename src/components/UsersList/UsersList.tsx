import React from 'react';

import {List, Paper} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import {createStyles, makeStyles, alpha, Theme} from '@material-ui/core/styles';

import {User} from '../../interfaces/user';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {UsersListItem} from './UsersListItem';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    paperRoot: {
      borderRadius: 10,
    },
    list: {
      '& > *': {
        marginBottom: theme.spacing(1.5),
      },
    },
    footer: {
      textAlign: 'center',
      paddingBottom: 20,
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 600,
    },
  }),
);

type UsersListProps = {
  users: User[];
  hasMore: boolean;
  loadNextPage: () => void;
  isSearching: boolean;
};

export const UsersList: React.FC<UsersListProps> = ({
  users,
  hasMore,
  loadNextPage,
  isSearching,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.list}>
      <Paper className={classes.paperRoot}>
        <List className={classes.root}>
          {users.length === 0 ? (
            <EmptyResult emptyContent={EmptyContentEnum.USER} />
          ) : (
            <>
              <div>
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
              </div>
              {hasMore ? (
                isSearching ? (
                  <div className={classes.footer}>
                    <Link component="button" className={classes.link}>
                      Loading more
                    </Link>
                  </div>
                ) : (
                  <div className={classes.footer}>
                    <Link component="button" className={classes.link} onClick={loadNextPage}>
                      Load more
                    </Link>
                  </div>
                )
              ) : (
                <></>
              )}
            </>
          )}
        </List>
      </Paper>
    </div>
  );
};
