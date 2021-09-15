import {SearchIcon, XCircleIcon, PlusCircleIcon} from '@heroicons/react/solid';

import React, {useState, useEffect} from 'react';

import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  SvgIcon,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteRenderOptionState,
} from '@material-ui/lab';

import {Experience, Tag} from '../../interfaces/experience';
import {People} from '../../interfaces/people';
import {Dropzone} from '../atoms/Dropzone';
import {ListItemComponent} from '../atoms/ListItem';
import {useStyles} from './Experience.styles';

type ExperienceEditorProps = {
  experience?: Experience;
  tags: Tag[];
  people: People[];
  onSearchTags: (query: string) => void;
  onSearchPeople: (query: string) => void;
  onSave: (experience: Partial<Experience>, tags: string[]) => void;
  onImageUpload: (files: File[]) => Promise<string>;
};

export const ExperienceEditor: React.FC<ExperienceEditorProps> = props => {
  const {experience, people, tags, onSave, onImageUpload} = props;
  const styles = useStyles();

  const [newExperience, setNewExperience] = useState<Partial<Experience>>();
  const [newTags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (experience) {
      setNewExperience(experience);

      if (experience.tags) {
        setTags(experience.tags.map(tag => tag.id));
      }
    }
  }, [experience]);

  const handleImageUpload = async (files: File[]) => {
    const url = await onImageUpload(files);

    setImage(url);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExperience(prevExperience => ({
      ...prevExperience,
      [field]: event.target.value,
    }));
  };

  const handleTagsChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: string[],
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'remove-option') {
      setTags(value);
    }

    if (reason === 'create-option') {
      setTags(value);
    }

    if (reason === 'select-option') {
      setTags(value);
    }
  };

  const handlePeopleChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: People[],
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'select-option') {
      setNewExperience(prevExperience => ({
        ...prevExperience,
        people: value,
      }));
    }
  };

  const removeSelectedPeople = (selected: People) => () => {
    setNewExperience(prevExperience => ({
      ...prevExperience,
      people: prevExperience?.people
        ? prevExperience?.people.filter(people => people.id != selected.id)
        : [],
    }));
  };

  const saveExperience = () => {
    if (newExperience) {
      onSave(newExperience, newTags);
    }
  };

  return (
    <div className={styles.root}>
      <Typography className={styles.title}>
        {experience ? 'Edit' : 'Create new'} Experience
      </Typography>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="experience-name">Experience Name</InputLabel>
        <OutlinedInput
          id="experience-name"
          placeholder="Experience Name"
          value={newExperience?.name}
          onChange={handleChange('name')}
          labelWidth={110}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="experience-description">Description</InputLabel>
        <OutlinedInput
          id="experience-description"
          placeholder="Description"
          value={newExperience?.description}
          onChange={handleChange('description')}
          labelWidth={70}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="experience-picture" shrink={true} className={styles.label}>
          Picture
        </InputLabel>
        <Dropzone onImageSelected={handleImageUpload} value={image} />
      </FormControl>

      <Autocomplete
        id="post-tags"
        freeSolo
        multiple
        value={newTags}
        options={tags.map(tag => tag.id)}
        disableClearable
        onChange={handleTagsChange}
        getOptionLabel={option => `#${option}`}
        renderInput={params => (
          <TextField
            {...params}
            label="Tags"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
            }}
          />
        )}
      />

      <Autocomplete
        id="post-people"
        className={styles.people}
        value={newExperience?.people}
        multiple
        options={people}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={option => option.name}
        disableClearable
        autoHighlight={false}
        popupIcon={<SvgIcon component={SearchIcon} />}
        onChange={handlePeopleChange}
        renderTags={() => null}
        renderInput={params => (
          <TextField
            {...params}
            label="People"
            placeholder="Search people here"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
            }}
          />
        )}
        renderOption={(option, state: AutocompleteRenderOptionState) => {
          return (
            <ListItemComponent
              title={option.name}
              subtitle={
                <Typography variant="caption">
                  5 followers on <b className={styles.social}>{option.platform}</b>
                </Typography>
              }
              avatar={option.profilePictureURL}
              size="medium"
              action={
                <IconButton>
                  {state.selected ? (
                    <SvgIcon component={XCircleIcon} color="error" />
                  ) : (
                    <SvgIcon component={PlusCircleIcon} />
                  )}
                </IconButton>
              }
            />
          );
        }}
      />

      <div className={styles.preview}>
        {newExperience?.people?.map(people => (
          <ListItemComponent
            key={people.id}
            title={people.name}
            subtitle={
              <Typography variant="caption">
                5 followers on <b className={styles.social}>{people.platform}</b>
              </Typography>
            }
            avatar={people.profilePictureURL}
            size="medium"
            action={
              <IconButton onClick={removeSelectedPeople(people)}>
                <SvgIcon component={XCircleIcon} color="error" />
              </IconButton>
            }
          />
        ))}
      </div>
      <FormControl fullWidth variant="outlined">
        <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          onClick={saveExperience}>
          Create Experience
        </Button>
      </FormControl>
    </div>
  );
};
