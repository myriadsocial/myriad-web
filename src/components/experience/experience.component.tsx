import React, {useEffect, useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import SaveIcon from '@material-ui/icons/Save';
import UpdateIcon from '@material-ui/icons/Update';

import ShowIf from '../common/show-if.component';
import ExperienceListComponent from './components/experience.component';
import LayoutOptions from './components/layout-options.component';
import PeopleComponent from './components/people.component';
import SearchExperienceComponent from './components/search-experience.component';
import TopicComponent from './components/topic.component';
import ExperienceDetail from './experience-detail.component';
import {useStyles} from './experience.style';
import {useExperience} from './use-experience.hooks';

import DialogTitle from 'src/components/common/DialogTitle.component';
import Panel from 'src/components/common/panel.component';
import {Experience, Tag, LayoutType} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';

type Props = {
  userId: string;
  anonymous: boolean;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ExperienceComponent = ({userId, anonymous}: Props) => {
  const style = useStyles();

  const {
    experiences,
    selected,
    searched,
    edit,
    loadInitExperience,
    loadMoreExperience,
    storeExperience,
    storeExperiences,
    editExperience,
    updateExperience,
    selectExperience,
    removeExperience,
    searchExperience,
    prependExperience,
  } = useExperience(userId);
  const [isEditing, setEditing] = useState(false);
  const [isEdited, setEdited] = useState(false);
  const [isManagingExperience, setManageExperience] = useState(false);
  const [isAdded, setAdded] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [addedExperience, setAddedExperience] = useState<Experience[]>([]);
  const [modalEditOpened, setModalEditOpen] = useState(false);
  const [modalAlertOpened, setModalAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    loadInitExperience();
  }, []);

  useEffect(() => {
    setSelectedExperience(selected);
  }, [selected]);

  // Customize Experience
  const editCurrentExperience = () => {
    setEditing(true);
    setManageExperience(false);
    setEdited(false);
  };

  const changeSelectedLayout = (type: LayoutType) => {
    if (!selectedExperience) {
      return;
    }

    setSelectedExperience({
      ...selectedExperience,
      layout: type,
    });

    setEdited(true);
  };

  const addPeopleToExperience = (people: People) => {
    if (!selectedExperience) {
      return;
    }

    setSelectedExperience({
      ...selectedExperience,
      people: [...selectedExperience.people, people],
    });

    setEdited(true);
  };

  const removePeopleFromExperience = (people: People) => {
    if (!selectedExperience) {
      return;
    }

    setSelectedExperience({
      ...selectedExperience,
      people: selectedExperience.people.filter(item => item.originUserId !== people.originUserId),
    });

    setEdited(true);
  };

  const addTopicToExperience = (tag: Tag) => {
    if (!selectedExperience) {
      return;
    }

    setSelectedExperience({
      ...selectedExperience,
      tags: [...selectedExperience.tags, tag],
    });

    setEdited(true);
  };

  const removeTopicFromExperience = (tag: Tag) => {
    if (!selectedExperience) {
      return;
    }

    setSelectedExperience({
      ...selectedExperience,
      tags: selectedExperience.tags.filter(item => item.id !== tag.id),
    });

    setEdited(true);
  };

  const discardChanges = () => {
    setSelectedExperience(selected);
    setEditing(false);
    setManageExperience(false);
    setAddedExperience([]);
    setEdited(false);
    setAdded(false);
  };

  // Managing Experience
  const manageExperience = () => {
    setEditing(false);
    setManageExperience(true);
    setAdded(false);
  };

  // Abort Managing Experience
  const handleClickOutsidePanel = () => {
    setEditing(false);
    setManageExperience(false);
    setAdded(false);
  };

  const showEditExperienceModal = () => {
    if (selectedExperience) {
      editExperience(selectedExperience);
      toggleEditModal();
    }
  };

  const updateSelectedExperience = (experience: Experience) => {
    if (selectedExperience && experience) {
      updateExperience(experience);
      toggleEditModal();
      discardChanges();
      notify('Experience updated');
    }
  };

  const saveAsNewExperience = () => {
    if (selectedExperience) {
      storeExperience(selectedExperience);
      discardChanges();
      notify('Experience added to your list');
    }
  };

  const saveAddedAsNewExperience = () => {
    if (addedExperience.length) {
      storeExperiences(addedExperience);
      discardChanges();
      notify('Experience added to your list');
    }
  };

  const addToMyExperience = (experience: Experience) => {
    if (experience) {
      if (anonymous) {
        prependExperience(experience);
      } else {
        setAddedExperience([...addedExperience, experience]);
      }

      setAdded(true);
    }
  };

  const removeFromAddedExperience = (id: string) => {
    setAddedExperience([...addedExperience.filter(experience => experience.id !== id)]);
    setAdded(true);
  };

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

  const toggleEditModal = () => {
    setModalEditOpen(!modalEditOpened);
  };

  const toggleAlertModal = () => {
    setModalAlertOpen(!modalAlertOpened);
  };

  const notify = (message: string) => {
    setShowNotification(true);
    setNotificationMessage(message);
  };

  const clearNotification = () => {
    setShowNotification(false);
    setNotificationMessage('');
  };

  return (
    <ClickAwayListener onClickAway={handleClickOutsidePanel}>
      <div className={style.root}>
        <Panel title="Experiences">
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedExperience?.name}
              </Typography>
              <Typography color="textSecondary">By {selectedExperience?.user?.name}</Typography>
              <Typography variant="body2" component="p">
                {selectedExperience && selectedExperience.description
                  ? selectedExperience.description
                  : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tortor justo, lobortis ut erat imperdiet, varius mollis nunc.
            Sed vehicula.`}
              </Typography>
            </CardContent>

            <ShowIf condition={false}>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={editCurrentExperience}
                  disabled={isEditing || selectedExperience?.createdBy !== userId}>
                  Customize
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={manageExperience}
                  disabled={isManagingExperience}>
                  Manage Experiences
                </Button>
              </CardActions>
            </ShowIf>
          </Card>

          <ShowIf condition={false}>
            <ShowIf condition={anonymous}>
              <SearchExperienceComponent
                title="Search Experience"
                data={searched}
                search={searchExperience}
                onSelected={addToMyExperience}
              />
            </ShowIf>
            <ExperienceListComponent
              title={anonymous ? 'Available Experiences' : 'My saved Experiences'}
              selected={selected}
              experiences={experiences}
              selectExperience={selectExperience}
              removeExperience={confirmRemove}
              loadMore={loadMoreExperience}
            />
          </ShowIf>

          <ShowIf condition={isManagingExperience}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add or Remove Experience{' '}
              </Typography>
            </CardContent>
            <SearchExperienceComponent
              title="Search Experience"
              data={searched}
              search={searchExperience}
              onSelected={addToMyExperience}
            />

            <List dense>
              {addedExperience.map(experience => {
                const labelId = `added-experience-list-${experience.id}`;
                return (
                  <ListItem key={experience.id} button>
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={experience.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => removeFromAddedExperience(experience.id)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>

            <ShowIf condition={addedExperience.length > 0}>
              <Grid className={style.action}>
                <Fab
                  onClick={saveAddedAsNewExperience}
                  className={style.extendedIcon}
                  size="small"
                  variant="extended"
                  color={isAdded ? 'secondary' : 'primary'}
                  aria-label="edit">
                  <SaveIcon />
                  Save
                </Fab>

                <Fab
                  className={style.extendedIcon}
                  size="small"
                  variant="extended"
                  onClick={discardChanges}>
                  <DeleteSweepIcon />
                  Discard
                </Fab>
              </Grid>
            </ShowIf>
          </ShowIf>

          <ShowIf condition={isEditing}>
            <LayoutOptions value={selectedExperience?.layout} onChanged={changeSelectedLayout} />
            <TopicComponent
              topics={selectedExperience?.tags || []}
              onAddItem={addTopicToExperience}
              onRemoveItem={removeTopicFromExperience}
            />
            <PeopleComponent
              people={selectedExperience?.people || []}
              onAddItem={addPeopleToExperience}
              onRemoveItem={removePeopleFromExperience}
            />
            <Grid className={style.action}>
              <ShowIf condition={selectedExperience?.createdBy === userId}>
                <Fab
                  onClick={showEditExperienceModal}
                  className={style.extendedIcon}
                  size="small"
                  variant="extended"
                  color={isEdited ? 'secondary' : 'primary'}
                  aria-label="add">
                  <UpdateIcon />
                  Update
                </Fab>
              </ShowIf>
              <ShowIf condition={selectedExperience?.createdBy !== userId}>
                <Fab
                  onClick={saveAsNewExperience}
                  className={style.extendedIcon}
                  size="small"
                  variant="extended"
                  color="secondary"
                  aria-label="edit">
                  <SaveIcon />
                  Save
                </Fab>
              </ShowIf>
              <Fab
                className={style.extendedIcon}
                size="small"
                variant="extended"
                onClick={discardChanges}>
                <DeleteSweepIcon />
                Discard
              </Fab>
            </Grid>
          </ShowIf>

          {edit && (
            <Dialog open={modalEditOpened} onClose={toggleEditModal} maxWidth="md">
              <DialogTitle id="connect-social" onClose={toggleEditModal}>
                {' '}
                This is what you are going to see
              </DialogTitle>
              <DialogContent dividers>
                <ExperienceDetail data={edit} onSave={updateSelectedExperience} />
              </DialogContent>
            </Dialog>
          )}

          <Dialog open={modalAlertOpened} onClose={toggleAlertModal}>
            <DialogTitle id="dialog-remove-experience" onClose={toggleAlertModal}>
              {'Remove Experince?'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are You sure to remove this experience?.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={toggleAlertModal} color="primary">
                Disagree
              </Button>
              <Button onClick={deleteExperience} color="secondary">
                Agree
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            color="secondary"
            open={showNotification}
            autoHideDuration={6000}
            onClose={clearNotification}
            message={notificationMessage}
          />
        </Panel>
      </div>
    </ClickAwayListener>
  );
};
