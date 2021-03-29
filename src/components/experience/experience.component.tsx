import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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
    editExperience,
    removeExperience
  } = useExperience();
  const [showMore, setShowMore] = useState(true);
  const [modalEditOpened, setModalEditOpen] = useState(false);
  const [modalAlertOpened, setModalAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadInitExperience();
  }, []);

  const loadMore = () => {
    if (showMore) {
      loadMoreExperience();
    }

    setShowMore(!showMore);
  };

  const toggleEditModal = () => {
    setModalEditOpen(!modalEditOpened);
  };

  const toggleAlertModal = () => {
    setModalAlertOpen(!modalAlertOpened);
  };

  const createExperience = (tags: string[], people: string[]) => {
    if (selected) {
      editExperience(selected, tags, people);

      toggleEditModal();
    }
  };

  const saveExperience = (experience: Experience) => {
    storeExperience(experience);

    toggleEditModal();
  };

  const addExperience = () => {};

  const confirmRemove = (id: string) => {
    toggleAlertModal();
    setDeleteId(id);
  };

  const deleteExperience = () => {
    if (deleteId) {
      removeExperience(deleteId);
      setDeleteId(null);
      toggleAlertModal();
    }
  };

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
                <Link underline="none" href="#" color="secondary" onClick={() => confirmRemove(experience.id)}>
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
        <Dialog open={modalEditOpened} onClose={toggleEditModal} maxWidth="md">
          <DialogTitle id="connect-social" onClose={toggleEditModal}>
            {' '}
            This is what you are going to see
          </DialogTitle>
          <DialogContent dividers>
            <ExperienceDetail data={edit} onSave={saveExperience} />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={modalAlertOpened} onClose={toggleAlertModal}>
        <DialogTitle id="dialog-remove-experience" onClose={toggleAlertModal}>
          {'Remove Experince?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are You sure to remove this experience?.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleAlertModal} color="primary">
            Disagree
          </Button>
          <Button onClick={deleteExperience} color="secondary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Panel>
  );
};
