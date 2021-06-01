import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import ShowIf from '../common/show-if.component';
import LoginComponent from '../login/login.component';
import { ProfileActionComponent } from './profile-action.component';
import { SocialListComponent } from './social-list.component';

import { acronym } from 'src/helpers/string';
import { ExtendedUser } from 'src/interfaces/user';

type Props = {
  loggedIn?: boolean;
  user: ExtendedUser;
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

const UserComponent: React.FC<Props> = ({ user }) => {
  const style = useStyles();

  const [loginOpened, openLogin] = React.useState(false);

  const toggleLogin = () => {
    openLogin(!loginOpened);
  };

  const getProfilePicture = (): string => {
    const avatar = user.profilePictureURL as string;

    return avatar || '';
  };

  return (
    <Box p={1} bgcolor="primary.light" className={style.root}>
      <Card className={style.cardProfile}>
        <CardHeader
          className={style.cardHeader}
          avatar={
            <Avatar
              aria-label={`${user.name} avatar`}
              src={getProfilePicture()}
              variant="circle"
              sizes="lg"
              style={{ width: 72, height: 72 }}>
              {acronym(user.name)}
            </Avatar>
          }
          title={
            <Typography variant="h4" style={{ marginBottom: 4, fontWeight: 400 }}>
              {user.name}
            </Typography>
          }
          subheader={<ProfileActionComponent anonymous={user.anonymous} user={user} />}
        />
        <CardContent style={{ padding: '16px 0' }}>
          <ShowIf condition={!user.anonymous}>
            <SocialListComponent user={user} />
          </ShowIf>
        </CardContent>
      </Card>

      <Dialog open={loginOpened} onClose={toggleLogin} maxWidth="xs">
        <LoginComponent allowAnonymous={false} />
      </Dialog>
    </Box>
  );
};

export default UserComponent;
