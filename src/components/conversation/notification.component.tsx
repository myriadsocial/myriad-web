import React from 'react';
import { createStyles, Theme, makeStyles, fade } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: 'inline'
    },
    notification: {
      backgroundColor: fade('#000', 0.3),
      borderRadius: 16,
      marginBottom: 16
    },
    notificationActive: {
      background: 'linear-gradient(180deg, rgba(160, 31, 171, 0.41) 0%, rgba(25, 26, 29, 0) 100%)',
      borderRadius: 16,
      marginBottom: 16
    }
  })
);

export default function NotificationListComponent() {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start" component="nav" className={classes.notificationActive}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                Ali Connors
              </Typography>
              {" — I'll be in your neighborhood doing errands this…"}
            </React.Fragment>
          }
        />
      </ListItem>

      <ListItem alignItems="flex-start" component="nav" className={classes.notification}>
        <ListItemAvatar>
          <Avatar alt="Travis Howard" src="/images/avatar/2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Summer BBQ"
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                to Scott, Alex, Jennifer
              </Typography>
              {" — Wish I could come, but I'm out of town this…"}
            </React.Fragment>
          }
        />
      </ListItem>

      <ListItem alignItems="flex-start" component="nav" className={classes.notification}>
        <ListItemAvatar>
          <Avatar alt="Cindy Baker" src="/images/avatar/3.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Oui Oui"
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                Sandra Adams
              </Typography>
              {' — Do you have Paris recommendations? Have you ever…'}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}
