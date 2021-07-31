import React from 'react';
import {useSelector} from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import {Theme, makeStyles, createStyles} from '@material-ui/core/styles';

import {ProfileActionComponent} from './profile-action.component';
import {SocialListComponent} from './social-list.component';

import {LoginFormComponent} from 'src/components/login/login-form.component';
import {ProfileEditComponent} from 'src/components/profile/edit/profile-edit.component';
import {acronym} from 'src/helpers/string';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type UserComponentProps = {
  isAnonymous: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(3),
      width: '100%',
      background: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.08))',
    },
    cardProfile: {
      boxShadow: 'none',
    },
    cardHeader: {
      padding: theme.spacing(2, 1),
      background: 'none',

      '& .MuiCardHeader-subheader .MuiButton-root': {
        marginRight: theme.spacing(1),

        '&:last-child': {
          marginRight: 0,
        },
      },
    },
    cardResetBackground: {
      background: 'none',
    },
    grow: {
      flexGrow: 1,
    },
    normal: {},
  }),
);

const UserComponent: React.FC<UserComponentProps> = ({isAnonymous}) => {
  const style = useStyles();

  const {user, alias} = useSelector<RootState, UserState>(state => state.userState);
  const [loginOpened, openLogin] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);

  const toggleLogin = () => {
    openLogin(!loginOpened);
  };

  const toggleEdit = () => {
    setEditProfile(!editProfile);
  };

  if (!isAnonymous && !user) return null;

  return (
    <Box p={1} bgcolor="primary.light" className={style.root} id="user-profile">
      <Card className={style.cardProfile}>
        <CardHeader
          className={style.cardHeader}
          avatar={
            <Avatar
              aria-label={`${user?.name || alias} avatar`}
              src={user?.profile_picture?.sizes.thumbnail}
              variant="circular"
              sizes="lg"
              style={{width: 72, height: 72}}>
              {acronym(user?.name || alias)}
            </Avatar>
          }
          title={
            <Typography variant="h4" style={{marginBottom: 4, fontWeight: 400}}>
              {user?.name || alias}
            </Typography>
          }
          subheader={
            <ProfileActionComponent
              userId={user?.id || null}
              anonymous={isAnonymous}
              onEditProfileClicked={toggleEdit}
              onLoginClicked={toggleLogin}
            />
          }
        />
        <CardContent style={{padding: '16px 0'}}>
          <SocialListComponent isAnonymous={isAnonymous} />
        </CardContent>
      </Card>

      {user && <ProfileEditComponent open={editProfile} toggleProfileForm={toggleEdit} />}

      <Dialog open={loginOpened} onClose={toggleLogin} maxWidth="xs">
        <LoginFormComponent />
      </Dialog>
    </Box>
  );
};

export default UserComponent;
