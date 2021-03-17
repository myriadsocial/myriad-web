import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import PhotoLayoutIcon from '../../images/photo-layout-light.svg';
import TimelineLayoutIcon from '../../images/timeline-layout-light.svg';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#424242',
    color: '#E0E0E0'
  },
  item: {
    padding: 0,
    marginBottom: 4,
    '&:last-child': {
      marginBottom: 0
    },
    '&.Mui-selected,&:hover': {
      backgroundColor: 'rgba(160, 31, 171, 0.41)'
    }
  },
  inline: {
    display: 'inline',
    color: '#E0E0E0'
  },
  header: {
    // padding: '0 16px'
  },
  icon: {
    paddingTop: 4,
    paddingLeft: 2,
    width: 60,
    height: 50
  }
});

export default function Layouts() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader disableTypography className={classes.header} title={<Typography variant="h5">Look And Feel</Typography>} />
      <CardContent>
        <List component="nav" className={classes.root}>
          <ListItem button alignItems="flex-start" className={classes.item} selected={true}>
            <ListItemIcon>
              <TimelineLayoutIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText
              primary="Timeline Layout"
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" className={classes.inline}>
                    Better if you enjoy conversations and are looking for discussions
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem button alignItems="flex-start" className={classes.item}>
            <ListItemIcon>
              <PhotoLayoutIcon className={classes.icon} />
            </ListItemIcon>

            <ListItemText
              primary="Photo Layout"
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" className={classes.inline}>
                    Better if you enjoy visuals and are looking for multimedia content
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
