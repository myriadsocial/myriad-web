import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { useFriendsHook } from 'src/hooks/use-friends-hook';
import { User } from 'src/interfaces/user';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 0,
      padding: '0 24px 0 24px',
      height: '100vh',
      maxWidth: 726,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926
      }
    },
    header: {
      padding: 8
    },
    searchContent: {
      maxHeight: 1200,
      overflow: 'auto'
    },
    iconButton: {
      margin: theme.spacing(1)
    }
  })
);

type SearchResultProps = {
  users: User[];
  loading?: boolean;
  user: User;
  clickBack: () => void;
};

const SearchResultComponent: React.FC<SearchResultProps> = ({ user, users, clickBack }) => {
  const styles = useStyles();

  const { friended, checkFriendStatus } = useFriendsHook(user);
  useEffect(() => {
    // list all transaction user id as param
    checkFriendStatus([]);
  }, []);

  const router = useRouter();
  const redirectToProfilePage = (url: string) => {
    router.push(`/${url}`);
  };

  const getFriendStatus = (user: User) => {
    const found = friended.find(friend => friend.id === user.id);

    return found ? found.status : null;
  };

  type CardActionProps = {
    from?: User;
    to?: User;
  };

  const CardActionButtons: React.FC<CardActionProps> = ({ from, to }) => {
    if (!from) return null;
    const status = getFriendStatus(from);

    return (
      <CardActions>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button
            onClick={() => redirectToProfilePage(from?.id)}
            size="medium"
            variant="contained"
            color="default"
            className={styles.iconButton}>
            Visit Profile
          </Button>
          {!status && (
            <Button size="medium" variant="contained" color="primary" className={styles.iconButton} startIcon={<PersonAddIcon />}>
              Add Friend
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
        <Button color="primary" onClick={clickBack}>
          Go back
        </Button>
      </div>
      <div>
        <List className={styles.searchContent}>
          {users.length === 0 ? (
            <EmptySearchResultComponent />
          ) : (
            users.map(user => (
              <ListItem key={user.id}>
                <Card>
                  <CardHeader avatar={<Avatar aria-label="avatar" src={user.profilePictureURL} />} title={RenderPrimaryText(user.name)} />
                  <CardActionButtons from={user} />
                </Card>
              </ListItem>
            ))
          )}
        </List>
      </div>
    </div>
  );
};

export default SearchResultComponent;
