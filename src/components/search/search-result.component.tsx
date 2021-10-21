import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import ShowIf from '../common/show-if.component';

import {AvatarComponent} from 'src/components/common/Avatar.component';
import {acronym} from 'src/helpers/string';
import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // padding: '0 24px 0 24px',
      height: '100vh',
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926,
      },
    },
    header: {
      padding: 8,
    },
    back: {
      background: theme.palette.secondary.light,
      color: theme.palette.background.paper,
      width: 40,
      height: 40,
    },
    searchContent: {
      marginTop: theme.spacing(1),
      maxHeight: 1200,
      overflow: 'auto',
    },
    listWrapper: {
      textAlign: 'center',
    },
    iconButton: {
      margin: theme.spacing(1),
    },
    content: {
      textAlign: 'center',
      lineHeight: '20px',
      color: '#9E9E9E',
      fontSize: '16px',
      width: '282px',
    },
  }),
);

type SearchResultProps = {
  options: User[];
  loading?: boolean;
  clickBack?: () => void;
};

const SearchResultComponent: React.FC<SearchResultProps> = ({options}) => {
  const styles = useStyles();

  const {anonymous, user} = useSelector<RootState, UserState>(state => state.userState);
  const {friended: friendsList, checkFriendStatus, sendRequest} = useFriendsHook();
  const router = useRouter();

  useEffect(() => {
    // list all transaction user id as param
    if (!anonymous && user) checkFriendStatus(options);
  }, []);

  const redirectToProfilePage = (url: string) => {
    router.push(`/${url}`);
  };

  const getFriendStatus = (user: User): FriendStatus | null => {
    const friendOrFriendRequested = friendsList.find(friend => {
      return friend.requestorId === user.id || friend.requesteeId == user.id;
    });
    return friendOrFriendRequested ? friendOrFriendRequested.status : null;
  };

  const sendFriendRequest = async (destination: User) => {
    await sendRequest(destination);
    checkFriendStatus(options);
  };

  type CardActionProps = {
    people?: User;
  };

  // TODO: separate this to single component file
  const CardActionButtons: React.FC<CardActionProps> = ({people}) => {
    if (!people) return null;

    const status = getFriendStatus(people);
    let disableRequest = false;

    if (status) {
      disableRequest = [FriendStatus.PENDING, FriendStatus.APPROVED].includes(status);
    }

    return (
      <CardActions>
        <div className={styles.listWrapper}>
          <Button
            onClick={() => redirectToProfilePage(people.id)}
            size="medium"
            variant="contained"
            color="default"
            className={styles.iconButton}>
            Visit Profile
          </Button>
          {people.id !== user?.id && (
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => sendFriendRequest(people)}
              disabled={anonymous || disableRequest}
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
              <ShowIf condition={status === null}>Add Friend {status}</ShowIf>
              <ShowIf condition={status === FriendStatus.PENDING}>Request Sent {status}</ShowIf>
              <ShowIf condition={status === FriendStatus.APPROVED}>Friend {status}</ShowIf>
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
        <Typography className={styles.content}>
          Sorry we can’t find anything with your keyword, you can try again with another keyword
        </Typography>
      </Grid>
    );
  };

  return (
    <div className={styles.root}>
      <div>
        <Grid container spacing={3} className={styles.searchContent}>
          {options.length === 0 ? (
            <Grid item xs={12}>
              <EmptySearchResultComponent />
            </Grid>
          ) : (
            options.map(people => (
              <Grid item xs={12} sm={6} key={people.id}>
                <Card>
                  <CardHeader
                    avatar={
                      <AvatarComponent aria-label="avatar" src={people.profilePictureURL}>
                        {acronym(people.name)}
                      </AvatarComponent>
                    }
                    title={RenderPrimaryText(people.name)}
                  />
                  <CardActionButtons people={people} />
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
