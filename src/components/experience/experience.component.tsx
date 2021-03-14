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
import uniqid from 'uniqid';
import { uniqueNamesGenerator, starWars } from 'unique-names-generator';
import ShowIf from '../common/show-if.component';

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
  const [next, setNext] = React.useState(true);
  const [experiences, setExperience] = React.useState([
    {
      id: uniqid(),
      title: 'Comedy'
    },
    {
      id: uniqid(),
      title: 'Cat Pictures'
    },
    {
      id: uniqid(),
      title: 'Food'
    }
  ]);

  const loadMore = () => {
    setExperience([
      ...experiences,
      ...Array(5)
        .fill(null)
        .map(() => ({
          id: uniqid(),
          title: uniqueNamesGenerator({
            dictionaries: [starWars]
          })
        }))
    ]);
    setNext(false);
  };

  return (
    <Panel title="Experiences">
      <List className={classes.root}>
        {experiences.map(experience => (
          <ListItem key={experience.id}>
            <ListItemIcon>
              <MyriadIcon />
            </ListItemIcon>
            <ListItemText id={experience.id} primary={experience.title} />
            <ListItemSecondaryAction>
              <Typography className={classes.root}>
                <Link underline="none" href="#" color="secondary">
                  Delete
                </Link>
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <ShowIf condition={next}>
        <Box className={classes.more}>
          <Button color="secondary" onClick={loadMore}>
            More...
          </Button>
        </Box>
      </ShowIf>

      <LayoutOptions />

      <TopicComponent />
    </Panel>
  );
});
