import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(2),
      color: '#E0E0E0'
    },
    textSecondary: {
      color: '#E0E0E0'
    },
    action: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white
    },
    badge: {
      textAlign: 'right',
      '& > *': {
        margin: '4px 2px',
        textAlign: 'right',
        height: theme.spacing(2),
        textTransform: 'uppercase'
      }
    },
    avatar: {
      minWidth: 40
    },
    green: {
      backgroundColor: '#4caf50',
      color: '#FFF'
    },
    red: {
      backgroundColor: '#f44336',
      color: '#FFF'
    }
  })
);

export const TransactionComponent = React.memo(function Wallet() {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem>
        <ListItemAvatar className={classes.avatar}>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          className={classes.textSecondary}
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          primary="Klara Velez"
          secondary="Tx: 0XEFJ5D4J8HF8D2281R8E5G"
        />
        <ListItemSecondaryAction>
          <div className={classes.badge}>
            <Chip color="default" size="small" label="Pending" />
            <Chip className={classes.red} color="default" size="small" label="Out" />
            <Typography>20 Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <ListItemAvatar className={classes.avatar}>
          <Avatar alt="Travis Howard" src="/images/avatar/2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Eduard Rudd"
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          secondary="Tx: 0XE5E9F55T7T9D5S59R9F75"
        />
        <ListItemSecondaryAction>
          <div className={classes.badge}>
            <Chip className={classes.green} color="default" size="small" label="In" />
            <Typography>14 Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <ListItemAvatar className={classes.avatar}>
          <Avatar alt="Remy Sharp" src="/images/avatar/3.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Rimsha Mills"
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          secondary="Tx: 0XEK8E49U5U7J5E7F66G484"
        />
        <ListItemSecondaryAction>
          <div className={classes.badge}>
            <Chip className={classes.green} color="default" size="small" label="In" />
            <Typography>14 Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <ListItemAvatar className={classes.avatar}>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Rimsha Mills"
          secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
          secondary="Tx: 0XEK8E49U5U7J5E7F66G484"
        />
        <ListItemSecondaryAction>
          <div className={classes.badge}>
            <Chip className={classes.green} color="default" size="small" label="In" />
            <Chip className={classes.red} color="default" size="small" label="Out" />
            <Typography>14 Myria</Typography>
          </div>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
});
