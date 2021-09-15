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
  const {experience, people, onSave, onImageUpload} = props;
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
    value: (string | string[])[],
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'remove-option') {
      if (typeof value === 'string') {
        setTags([value]);
      }

      if (typeof value === 'object') {
        setTags(value.flat());
      }
    }

    if (reason === 'create-option') {
      const createdTags: string[] = [];

      if (typeof value === 'string') {
        createdTags.push(value);
      }

      if (typeof value === 'object') {
        createdTags.push(...value.flat());
      }

      setTags(createdTags);
    }
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
          value={experience?.name}
          onChange={handleChange('name')}
          labelWidth={110}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="experience-description">Description</InputLabel>
        <OutlinedInput
          id="experience-description"
          placeholder="Description"
          value={experience?.description}
          onChange={handleChange('description')}
          labelWidth={70}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <Dropzone onImageSelected={handleImageUpload} value={image} />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <Autocomplete
          id="post-tags"
          freeSolo
          multiple
          value={newTags}
          options={[]}
          disableClearable
          onChange={handleTagsChange}
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
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <Autocomplete
          id="post-people"
          className={styles.people}
          value={newExperience?.people}
          multiple
          options={people}
          getOptionSelected={(option, value) => option === value}
          getOptionLabel={option => option.name}
          disableClearable
          popupIcon={<SvgIcon component={SearchIcon} />}
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
                  <Typography>
                    5 followers on <b>{option.platform}</b>
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
      </FormControl>

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
