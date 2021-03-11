import React from 'react';
import { Theme, withStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreRounded from '@material-ui/icons/ExpandMoreRounded';
import Badge from '@material-ui/core/Badge';

import Profile from './profile.component';
import Social from './social.component';
import Setting from './setting.component';
import NotificationListComponent from '../conversation/notification.component';
import LoginComponent from '../login/login.component';
import ShowIf from '../common/show-if.component';

type Props = {
  loggedIn?: boolean;
  settings: any;
  changeSetting: (key, value) => void;
};

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

const User = ({ loggedIn = true, settings, changeSetting }: Props) => {
  const [loginOpened, openLogin] = React.useState(false);

  const handleClose = () => {
    openLogin(false);
  };

  const toggleLogin = open => {
    openLogin(open);
  };

  return (
    <Box p={1} bgcolor="primary.light">
      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item>
          <Profile loggedIn={loggedIn} toggleLogin={toggleLogin} />
          <Social loggedIn={loggedIn} toggleLogin={toggleLogin} />
        </Grid>
        <ShowIf condition={loggedIn}>
          <Grid item>
            <Setting onChange={changeSetting} settings={settings} />
          </Grid>
        </ShowIf>
      </Grid>

      <ShowIf condition={loggedIn}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreRounded color="secondary" />}>
            <StyledBadge badgeContent={4} color="secondary">
              <Typography variant="h5">Conversations</Typography>
            </StyledBadge>
          </AccordionSummary>
          <AccordionDetails>
            <NotificationListComponent />
          </AccordionDetails>
        </Accordion>
      </ShowIf>

      <Dialog open={loginOpened} onClose={handleClose} maxWidth="xs">
        <LoginComponent />
      </Dialog>
    </Box>
  );
};

export default User;
