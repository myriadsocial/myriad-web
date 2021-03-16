import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Panel from '../common/panel.component';
import LayoutOptions from './layout-options.component';
import TopicComponent from './topic.component';
import theme from '../../themes/default';
import MyriadIcon from '../../images/myriad-alternative.svg';
import { Experience } from '../../interfaces/experience';
import DialogTitle from '../common/DialogTitle.component';
import { experiencesData, generateExperience } from './data';
import ExperienceDetail from './experience-detail.component';
import SearchComponent from '../../components/common/search.component';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2)
    },
    item: {
      '&.Mui-selected': {
        backgroundImage: 'linear-gradient(to right, #E849BD, lightpink)',
        color: '#171717'
      }
    },
    action: {
      textAlign: 'center'
    },
    more: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    show: {
      color: '#E849BD'
    },
    normal: {},
    expand: {
      transform: 'rotate(180deg)'
    }
  })
);

export const ExperienceComponent = () => {
  const classes = useStyles();
  const [showMore, setShowMore] = React.useState(true);
  const [experiences, setExperience] = React.useState<Experience[]>(experiencesData);
  const [selectedExperience, setSelectedExperience] = React.useState<Experience>(experiences[0]);
  const [modalOpened, setModalOpen] = React.useState(false);

  const loadMore = () => {
    if (showMore) {
      setExperience([...experiences, ...generateExperience(5)]);
    } else {
      setExperience(experiencesData);
    }

    setShowMore(!showMore);
  };

  const selectExperience = id => {
    const experience = experiences.find(item => item.id === id);

    if (experience) {
      setExperience(
        experiences.map(item => {
          item.selected = item.id === id;

          return item;
        })
      );

      setSelectedExperience(experience);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpened);
  };

  const createExperience = (topics, people) => {
    setSelectedExperience({
      ...selectedExperience,
      setting: {
        ...selectedExperience.setting,
        topics,
        people
      }
    });
    toggleModal();
  };

  const saveExperience = (experience: Experience) => {
    setExperience([experience, ...experiences]);

    setSelectedExperience(experience);

    toggleModal();
  };

  const addExperience = () => {};

  return (
    <Panel title="Experiences">
      <SearchComponent onSubmit={addExperience} />
      <List className={classes.root}>
        {experiences.map(experience => (
          <ListItem
            button
            className={classes.item}
            key={experience.id}
            onClick={() => selectExperience(experience.id)}
            selected={experience.selected}>
            <ListItemIcon>
              <MyriadIcon />
            </ListItemIcon>
            <ListItemText id={experience.id} primary={experience.title} />
            <ListItemSecondaryAction>
              <Typography className={classes.action}>
                <Link underline="none" href="#" color="secondary">
                  Delete
                </Link>
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Box className={classes.more}>
        <Button color="secondary" className={classes.show} onClick={loadMore}>
          {showMore ? 'Show All' : 'Hide Some'} <ExpandMoreIcon className={showMore ? classes.normal : classes.expand} />
        </Button>
      </Box>

      <LayoutOptions />

      <TopicComponent
        topics={selectedExperience.setting.topics}
        people={selectedExperience.setting.people}
        createExperience={createExperience}
      />

      <Dialog open={modalOpened} onClose={toggleModal} maxWidth="sm">
        <DialogTitle id="connect-social" onClose={toggleModal}>
          {' '}
          This is what you are going to see
        </DialogTitle>
        <DialogContent dividers>
          <ExperienceDetail topics={selectedExperience.setting.topics} people={selectedExperience.setting.people} onSave={saveExperience} />
        </DialogContent>
      </Dialog>
    </Panel>
  );
};
