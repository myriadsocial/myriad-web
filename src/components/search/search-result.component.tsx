import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import ShowIf from '../common/show-if.component';

import { useFriendsHook } from 'src/hooks/use-friends-hook';
import { FriendStatus } from 'src/interfaces/friend';
import { User } from 'src/interfaces/user';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0 24px 0 24px',
      height: '100vh',
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926
      }
    },
    header: {
      padding: 8
    },
    back: {
      background: theme.palette.secondary.light,
      color: theme.palette.background.paper,
      width: 40,
      height: 40
    },
    searchContent: {
      marginTop: theme.spacing(1),
      maxHeight: 1200,
      overflow: 'auto'
    },
    listWrapper: {
      textAlign: 'center'
    },
    iconButton: {
      margin: theme.spacing(1)
    }
  })
);

type SearchResultProps = {
  isAnonymous: boolean;
  users: User[];
  loading?: boolean;
  user: User | null;
  clickBack: () => void;
};

const SearchResultComponent: React.FC<SearchResultProps> = ({ isAnonymous, user, users, clickBack }) => {
  const styles = useStyles();

  const { friended, checkFriendStatus, sendRequest } = useFriendsHook(user);

  useEffect(() => {
    // list all transaction user id as param
    if (user) checkFriendStatus([user.id]);
  }, []);

  const router = useRouter();
  const redirectToProfilePage = (url: string) => {
    router.push(`/${url}`);
  };

  const getFriendStatus = (user: User): FriendStatus | null => {
    const found = friended.find(friend => {
      return friend.requestorId === user.id || friend.friendId == user.id;
    });
    return found ? found.status : null;
  };

  const sendFriendRequest = (destinationId: string) => {
    sendRequest(destinationId);

    checkFriendStatus(users.map(item => item.id));
  };

  type CardActionProps = {
    from?: User;
    to?: User;
  };

  const CardActionButtons: React.FC<CardActionProps> = ({ from, to }) => {
    if (!from) return null;

    const status = getFriendStatus(from);
    let disableRequest = false;

    if (status) {
      disableRequest = [FriendStatus.PENDING, FriendStatus.APPROVED, FriendStatus.REJECTED].includes(status);
    }

    return (
      <CardActions>
        <div className={styles.listWrapper}>
          <Button
            onClick={() => redirectToProfilePage(from.id)}
            size="medium"
            variant="contained"
            color="default"
            className={styles.iconButton}>
            Visit Profile
          </Button>
          {from.id !== user?.id && (
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => sendFriendRequest(from.id)}
              disabled={isAnonymous || disableRequest}
              className={styles.iconButton}
              startIcon={
                <>
                  <ShowIf condition={status === null}>
                    <PersonAddIcon />
                  </ShowIf>
                  <ShowIf condition={status === FriendStatus.APPROVED}>
                    <PersonIcon />
                  </ShowIf>
                </>
              }>
              <ShowIf condition={status === null}>Add Friend</ShowIf>
              <ShowIf condition={status === FriendStatus.PENDING}>Request Sent</ShowIf>
              <ShowIf condition={status === FriendStatus.APPROVED}>Friend</ShowIf>
              <ShowIf condition={status === FriendStatus.REJECTED}>Rejected</ShowIf>
            </Button>
          )}
        </div>
      </CardActions>
    );
  };

  const RenderPrimaryText = (userName: string) => {
    return (
      <div>
        <Typography>{userName}</Typography>
      </div>
    );
  };

  const EmptySearchResultComponent = () => {
    return (
      <Grid container justify="center">
        <Typography>No results found!</Typography>
      </Grid>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          Search results
        </Typography>
      </div>
      <div>
        <IconButton className={styles.back} aria-label="back" size="medium" onClick={clickBack}>
          <ArrowBackIcon />
        </IconButton>
      </div>
      <div>
        <Grid container spacing={3} className={styles.searchContent}>
          {users.length === 0 ? (
            <Grid item xs={12}>
              <EmptySearchResultComponent />
            </Grid>
          ) : (
            users.map(user => (
              <Grid item xs={12} sm={6} key={user.id}>
                <Card>
                  <CardHeader avatar={<Avatar aria-label="avatar" src={user.profilePictureURL} />} title={RenderPrimaryText(user.name)} />
                  <CardActionButtons from={user} />
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </div>
  );
};

export default SearchResultComponent;
