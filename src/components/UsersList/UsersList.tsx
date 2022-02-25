import React from 'react';

import {List, Paper, CircularProgress, Link} from '@material-ui/core';
import {createStyles, makeStyles, alpha, Theme} from '@material-ui/core/styles';

import {User} from '../../interfaces/user';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {AvatarSize} from '../atoms/Avatar';
import {UsersListItem} from './UsersListItem';

import {LoadingDots} from 'src/components/atoms/Loading/LoadingDots';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 10,
      '& > *': {
        marginBottom: theme.spacing(1.5),
      },
    },
    list: {
      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    loadMore: {
      display: 'flex',
      textAlign: 'center',
      paddingBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
      textAlign: 'center',
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
    <Paper className={classes.root}>
      <List className={classes.list}>
        {users.length === 0 ? (
          <EmptyResult emptyContent={EmptyContentEnum.USER} />
        ) : (
          <>
            <div>
              {users.map(user => (
                <UsersListItem
                  user={user}
                  key={user.id}
                  size={AvatarSize.LARGE}
                  url={`/profile/${user.id}`}
                />
              ))}
            </div>
            {hasMore ? (
              isSearching ? (
                <div className={classes.loadMore}>
                  <CircularProgress size={16} style={{marginRight: 8}} thickness={4} />
                  <div className={classes.footer}>
                    <Link component="button" className={classes.link}>
                      Loading more
                    </Link>
                  </div>
                  <LoadingDots />
                </div>
              ) : (
                <div style={{paddingBottom: 20}}>
                  <div className={classes.footer}>
                    <Link component="button" className={classes.link} onClick={loadNextPage}>
                      Load more
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <></>
            )}
          </>
        )}
      </List>
    </Paper>
  );
};
