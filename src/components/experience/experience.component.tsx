import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Panel from '../common/panel.component';
import LayoutOptions from './layout-options.component';
import TopicComponent from './topic.component';
import theme from '../../themes/default';
import MyriadIcon from '../../images/myriad-alternative.svg';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      display: 'block',
      backgroundColor: '#424242',
      color: '#E0E0E0',
      marginBottom: theme.spacing(2)
    },
    more: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })
);

export const ExperienceComponent = React.memo(function Wallet() {
  const classes = useStyles();

  return (
    <Panel title="Experiences">
      <List className={classes.root}>
        <ListItem>
          <ListItemIcon>
            <MyriadIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-wifi" primary="Comedy" />
          <ListItemSecondaryAction>
            <Typography className={classes.root}>
              <Link underline="none" href="#" color="secondary">
                Delete
              </Link>
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <MyriadIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Cat Pictures" />
          <ListItemSecondaryAction>
            <Typography className={classes.root}>
              <Link underline="none" href="#" color="secondary">
                Delete
              </Link>
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <MyriadIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Food" />
          <ListItemSecondaryAction>
            <Typography className={classes.root}>
              <Link underline="none" href="#" color="secondary">
                Delete
              </Link>
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Box className={classes.more}>
        <Button color="secondary">More...</Button>
      </Box>

      <LayoutOptions />

      <TopicComponent />
    </Panel>
  );
});
