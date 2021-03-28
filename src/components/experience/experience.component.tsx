import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import LayoutOptions from './components/layout-options.component';
import TopicComponent from './components/topic.component';
import ExperienceDetail from './experience-detail.component';
import { useStyles } from './experience.style';
import { useExperience } from './use-experience.hooks';

import DialogTitle from 'src/components/common/DialogTitle.component';
import Panel from 'src/components/common/panel.component';
import SearchComponent from 'src/components/common/search.component';
import MyriadIcon from 'src/images/myriad-alternative.svg';
import { Experience } from 'src/interfaces/experience';

export const ExperienceComponent = () => {
  const style = useStyles();

  const {
    experiences,
    selected,
    edit,
    loadInitExperience,
    loadMoreExperience,
    storeExperience,
    selectExperience,
    editExperience
  } = useExperience();
  const [showMore, setShowMore] = React.useState(true);
  const [modalOpened, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    loadInitExperience();
  }, []);

  const loadMore = () => {
    if (showMore) {
      loadMoreExperience();
    }

    setShowMore(!showMore);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpened);
  };

  const createExperience = (tags: string[], people: string[]) => {
    if (selected) {
      editExperience(selected, tags, people);

      toggleModal();
    }
  };

  const saveExperience = (experience: Experience) => {
    storeExperience(experience);

    toggleModal();
  };

  const addExperience = () => {};

  return (
    <Panel title="Experiences">
      <SearchComponent onSubmit={addExperience} />
      <List className={style.root}>
        {experiences.map(experience => (
          <ListItem
            button
            className={style.item}
            key={experience.id}
            onClick={() => selectExperience(experience.id)}
            selected={experience.id === selected?.id}>
            <ListItemIcon>
              <MyriadIcon />
            </ListItemIcon>
            <ListItemText id={experience.id} primary={experience.name} />
            <ListItemSecondaryAction>
              <Typography className={style.action}>
                <Link underline="none" href="#" color="secondary">
                  Delete
                </Link>
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Box className={style.more}>
        <Button color="secondary" className={style.show} onClick={loadMore}>
          {showMore ? 'Show All' : 'Show Less'} <ExpandMoreIcon className={showMore ? style.normal : style.expand} />
        </Button>
      </Box>

      <LayoutOptions />

      {selected && <TopicComponent topics={selected.tags} people={selected.people} createExperience={createExperience} />}

      {edit && (
        <Dialog open={modalOpened} onClose={toggleModal} maxWidth="md">
          <DialogTitle id="connect-social" onClose={toggleModal}>
            {' '}
            This is what you are going to see
          </DialogTitle>
          <DialogContent dividers>
            <ExperienceDetail data={edit} onSave={saveExperience} />
          </DialogContent>
        </Dialog>
      )}
    </Panel>
  );
};
