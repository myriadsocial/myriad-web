import React from 'react';

import { useSession } from 'next-auth/client';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import ExpandMoreRounded from '@material-ui/icons/ExpandMoreRounded';

import ShowIf from '../common/show-if.component';
import NotificationListComponent from '../conversation/notification.component';
import { useConversationHook } from '../conversation/use-conversation-hook';
import LoginComponent from '../login/login.component';
import Profile from './profile.component';
import Setting from './setting.component';
import Social from './social.component';

import { SocialsEnum } from 'src/interfaces';
import { LayoutFilterType } from 'src/interfaces/setting';

type Props = {
  loggedIn?: boolean;
  settings: any;
  changeSetting: (key: LayoutFilterType | SocialsEnum, value: boolean) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(3)
    },
    grow: {
      flexGrow: 1
    },
    normal: {}
  })
);

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -16,
      top: 12,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px'
    }
  })
)(Badge);

const User = ({ settings, changeSetting }: Props) => {
  const style = useStyles();

  const [session] = useSession();
  const [loginOpened, openLogin] = React.useState(false);

  if (!session || !session.user) return null;

  const { conversations } = useConversationHook(session.user);

  const toggleLogin = () => {
    openLogin(!loginOpened);
  };

  return (
    <Box p={1} bgcolor="primary.light" className={style.root}>
      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item md={7} className={!!session?.user.anonymous ? style.grow : style.normal}>
          <Profile toggleLogin={toggleLogin} user={session.user} />
        </Grid>
        <Grid item md={5} className={!!session?.user.anonymous ? style.grow : style.normal}>
          <Setting onChange={changeSetting} settings={settings} />
        </Grid>
        <ShowIf condition={!session?.user.anonymous}>
          <Grid item md={12}>
            <Social toggleLogin={toggleLogin} onChange={changeSetting} settings={settings} user={session.user} />
          </Grid>
        </ShowIf>
      </Grid>

      <ShowIf condition={false}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreRounded color="secondary" />}>
            <StyledBadge badgeContent={conversations.length} color="secondary">
              <Typography variant="h5">Conversations</Typography>
            </StyledBadge>
          </AccordionSummary>
          <AccordionDetails>
            <NotificationListComponent user={session.user} />
          </AccordionDetails>
        </Accordion>
      </ShowIf>

      <Dialog open={loginOpened} onClose={toggleLogin} maxWidth="xs">
        <LoginComponent allowAnonymous={false} />
      </Dialog>
    </Box>
  );
};

export default User;
