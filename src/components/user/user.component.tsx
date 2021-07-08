import React from 'react';

import { User } from 'next-auth';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import { ProfileActionComponent } from './profile-action.component';
import { SocialListComponent } from './social-list.component';

import { WithAdditionalParams } from 'next-auth/_utils';
import { LoginFormComponent } from 'src/components/login/login-form.component';
import { ProfileEditComponent } from 'src/components/profile/profile-edit.component';
import { useUser } from 'src/context/user.context';
import { acronym } from 'src/helpers/string';

type Props = {
  isAnonymous: boolean;
  user: WithAdditionalParams<User>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(3),
      width: '100%',
      background: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.08))'
    },
    cardProfile: {
      boxShadow: 'none'
    },
    cardHeader: {
      padding: theme.spacing(2, 1),
      background: 'none',

      '& .MuiCardHeader-subheader .MuiButton-root': {
        marginRight: theme.spacing(1),

        '&:last-child': {
          marginRight: 0
        }
      }
    },
    cardResetBackground: {
      background: 'none'
    },
    grow: {
      flexGrow: 1
    },
    normal: {}
  })
);

const UserComponent: React.FC<Props> = ({ isAnonymous, user }) => {
  const style = useStyles();

  const { state: userState } = useUser();
  const [loginOpened, openLogin] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);

  const toggleLogin = () => {
    openLogin(!loginOpened);
  };

  const toggleEdit = () => {
    setEditProfile(!editProfile);
  };

  const getProfilePicture = (): string => {
    const avatar = userState.user?.profilePictureURL as string;

    return avatar || '';
  };

  return (
    <Box p={1} bgcolor="primary.light" className={style.root} id="user-profile">
      <Card className={style.cardProfile}>
        <CardHeader
          className={style.cardHeader}
          avatar={
            <Avatar
              aria-label={`${isAnonymous ? user.name : userState.user?.name} avatar`}
              src={getProfilePicture()}
              variant="circular"
              sizes="lg"
              style={{ width: 72, height: 72 }}>
              {isAnonymous ? acronym(user.name as string) : acronym(userState.user?.name as string)}
            </Avatar>
          }
          title={
            <Typography variant="h4" style={{ marginBottom: 4, fontWeight: 400 }}>
              {isAnonymous ? user.name : userState.user?.name}
            </Typography>
          }
          subheader={
            <ProfileActionComponent
              userId={userState.user?.id || null}
              anonymous={isAnonymous}
              onEditProfileClicked={toggleEdit}
              onLoginCliked={toggleLogin}
            />
          }
        />
        <CardContent style={{ padding: '16px 0' }}>
          <SocialListComponent isAnonymous={isAnonymous} user={userState.user} />
        </CardContent>
      </Card>

      {userState.user && <ProfileEditComponent open={editProfile} user={userState.user} toggleProfileForm={toggleEdit} />}

      <Dialog open={loginOpened} onClose={toggleLogin} maxWidth="xs">
        <LoginFormComponent />
      </Dialog>
    </Box>
  );
};

export default UserComponent;
