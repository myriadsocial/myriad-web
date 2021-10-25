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

import {debounce} from 'lodash';

type ExperienceEditorProps = {
  type?: string;
  experience?: Experience | null;
  tags: Tag[];
  people: People[];
  onSearchTags: (query: string) => void;
  onSearchPeople: (query: string) => void;
  onSave: (experience: Partial<Experience>, tags: string[]) => void;
  onImageUpload: (files: File[]) => Promise<string>;
};

export const ExperienceEditor: React.FC<ExperienceEditorProps> = props => {
  const {type, experience, people, tags, onSave, onImageUpload, onSearchTags, onSearchPeople} =
    props;
  const styles = useStyles();

  const [newExperience, setNewExperience] = useState<Partial<Experience>>();
  const [newTags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<string>();
  const [disable, setDisable] = useState<boolean>(true);

  useEffect(() => {
    if (experience) {
      setNewExperience(experience);

      if (experience.tags) {
        const formatTag = experience.tags as unknown;
        const tagExperience = formatTag as string[];
        setTags(tagExperience);
      }

      if (experience.experienceImageURL) {
        setImage(experience.experienceImageURL);
      }
    }
  }, [experience]);

  useEffect(() => {
    if (experience && newExperience) {
      if (experience.name !== newExperience.name) setDisable(false);
      if (experience.description !== newExperience.description) setDisable(false);
      if (experience.experienceImageURL !== newExperience.experienceImageURL) setDisable(false);
      if (experience.people !== newExperience.people) setDisable(false);
    }
    if (newExperience) setDisable(false);
  }, [newExperience]);

  const handleSearchTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    const debounceSubmit = debounce(() => {
      onSearchTags(event.target.value);
    }, 300);

    debounceSubmit();
  };

  const handleSearchPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
    const debounceSubmit = debounce(() => {
      onSearchPeople(event.target.value);
    }, 300);

    debounceSubmit();
  };

  const handleImageUpload = async (files: File[]) => {
    const url = await onImageUpload(files);

    setImage(url);
    setNewExperience({...newExperience, experienceImageURL: url});
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExperience(prevExperience => ({
      ...prevExperience,
      [field]: event.target.value,
    }));
  };

  const handleTagsInputChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    const options = newValue.split(/[ ,]+/);

    const fieldValue = newTags
      .concat(options)
      .map(x => x.trim())
      .filter(x => x);

    if (options.length > 1) {
      handleTagsChange(event, fieldValue, 'create-option');
    }
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
      setTags(value.map(item => item.replace('#', '')));
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
      <Typography className={styles.title}>{type ? type : 'Create new'} Experience</Typography>

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
        onInputChange={handleTagsInputChange}
        getOptionLabel={option => `#${option}`}
        renderInput={params => (
          <TextField
            {...params}
            label="Tags"
            variant="outlined"
            onChange={handleSearchTags}
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
            onChange={handleSearchPeople}
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
                <IconButton className={styles.removePeople}>
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
          disabled={disable}
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          onClick={saveExperience}>
          {type ? type : 'Create'} Experience
        </Button>
      </FormControl>
    </div>
  );
};
