import {SearchIcon, XCircleIcon, PlusCircleIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

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
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteRenderOptionState,
} from '@material-ui/lab';

import {ExperienceProps, Tag} from '../../interfaces/experience';
import {People} from '../../interfaces/people';
import {Dropzone} from '../atoms/Dropzone';
import {ListItemPeopleComponent} from '../atoms/ListItem/ListItemPeople';
import ShowIf from '../common/show-if.component';
import {useStyles} from './Experience.styles';

import {debounce, isEmpty} from 'lodash';

type ExperienceEditorProps = {
  type?: 'clone' | 'edit';
  isEdit?: boolean;
  experience?: ExperienceProps;
  tags: Tag[];
  people: People[];
  onSearchTags: (query: string) => void;
  onSearchPeople: (query: string) => void;
  onSave: (experience: ExperienceProps) => void;
  onImageUpload: (files: File[]) => Promise<string>;
};

enum TagsProps {
  ALLOWED = 'allowed',
  PROHIBITED = 'prohibited',
}

const DEFAULT_EXPERIENCE: ExperienceProps = {
  name: '',
  allowedTags: [],
  people: [],
  prohibitedTags: [],
};

export const ExperienceEditor: React.FC<ExperienceEditorProps> = props => {
  const {
    type,
    isEdit,
    experience = DEFAULT_EXPERIENCE,
    people,
    tags,
    onSave,
    onImageUpload,
    onSearchTags,
    onSearchPeople,
  } = props;
  const styles = useStyles();

  const [newExperience, setNewExperience] = useState<ExperienceProps>(experience);
  const [image, setImage] = useState<string | undefined>(experience.experienceImageURL);
  const [isDetailChanged, setDetailChanged] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

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

  const clearSearchedPeople = () => {
    const debounceSubmit = debounce(() => {
      onSearchPeople('');
    }, 300);

    debounceSubmit();
  };

  const handleImageUpload = async (files: File[]) => {
    if (files.length > 0) {
      setIsloading(true);
      const url = await onImageUpload(files);

      setIsloading(false);
      setImage(url);
      setNewExperience({...newExperience, experienceImageURL: url});
    } else {
      setNewExperience({...newExperience, experienceImageURL: undefined});
    }

    setDetailChanged(true);
  };

  const handleChange =
    (field: keyof ExperienceProps) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trimStart();

      setNewExperience(prevExperience => ({
        ...prevExperience,
        [field]: value,
      }));

      setDetailChanged(experience[field] !== value);
    };

  const handleTagsInputChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    newValue: string,
    type: TagsProps,
  ) => {
    const options = newValue.split(/[ ,]+/);

    let tmpTags: string[] = [];
    if (type === TagsProps.ALLOWED) {
      tmpTags = newExperience.allowedTags;
    } else if (type === TagsProps.PROHIBITED) {
      tmpTags = newExperience.prohibitedTags ?? [];
    }

    const fieldValue = tmpTags
      .concat(options)
      .map(x => x.trim())
      .filter(x => x);

    if (options.length > 1) {
      handleTagsChange(event, fieldValue, 'create-option', type);
    }
  };

  const handleTagsChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: string[],
    reason: AutocompleteChangeReason,
    type: TagsProps,
  ) => {
    const data = [...new Set(value.map(tag => tag.replace('#', '')))];
    const prohibitedTagsChanged =
      type === TagsProps.PROHIBITED &&
      (data.filter(tag => !experience?.prohibitedTags || !experience.prohibitedTags.includes(tag))
        .length > 0 ||
        experience?.prohibitedTags?.length !== data.length);
    const allowedTagsChanged =
      type === TagsProps.ALLOWED &&
      (data.filter(tag => !experience.allowedTags.includes(tag)).length > 0 ||
        data.length !== experience.allowedTags.length);

    setDetailChanged(prohibitedTagsChanged || allowedTagsChanged);

    if (reason === 'remove-option') {
      if (type === TagsProps.ALLOWED) {
        setNewExperience(prevExperience => ({
          ...prevExperience,
          allowedTags: data,
        }));
      } else if (type === TagsProps.PROHIBITED) {
        setNewExperience(prevExperience => ({
          ...prevExperience,
          prohibitedTags: data,
        }));
      }
    }

    if (reason === 'create-option') {
      if (type === TagsProps.ALLOWED) {
        setNewExperience(prevExperience => ({
          ...prevExperience,
          allowedTags: data,
        }));
      } else if (type === TagsProps.PROHIBITED) {
        setNewExperience(prevExperience => ({
          ...prevExperience,
          prohibitedTags: data,
        }));
      }
    }

    if (reason === 'select-option') {
      if (type === TagsProps.ALLOWED) {
        setNewExperience(prevExperience => ({
          ...prevExperience,
          allowedTags: data,
        }));
      } else if (type === TagsProps.PROHIBITED) {
        setNewExperience(prevExperience => ({
          ...prevExperience,
          prohibitedTags: data,
        }));
      }
    }
  };

  const handlePeopleChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: People[],
    reason: AutocompleteChangeReason,
  ) => {
    const people = newExperience?.people ? newExperience.people : [];
    if (reason === 'select-option') {
      setNewExperience(prevExperience => ({
        ...prevExperience,
        people: [...people, ...value.filter(option => people.indexOf(option) === -1)],
      }));
      clearSearchedPeople();
    }

    setDetailChanged(true);
  };

  const removeSelectedPeople = (selected: People) => () => {
    setNewExperience(prevExperience => ({
      ...prevExperience,
      people: prevExperience?.people
        ? prevExperience?.people.filter(people => people.id != selected.id)
        : [],
    }));

    setDetailChanged(true);
  };

  const isValidExperience = (): boolean => {
    if (newExperience.name.length === 0) return false;

    if (!newExperience.experienceImageURL) return false;

    if (newExperience.allowedTags.length === 0) return false;

    if (newExperience.people.filter(people => !isEmpty(people.id)).length === 0) return false;

    return true;
  };

  const saveExperience = () => {
    if (!isValidExperience()) return;

    onSave(newExperience);
  };

  const renderLabelButton = () => {
    if (type === 'edit') return 'Save changes';
    else if (type === 'clone') return 'Clone Experience';
    else return 'Create Experience';
  };

  return (
    <div className={styles.root}>
      <Typography className={styles.title}>{type ? type : 'Create new'} Experience</Typography>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="experience-name">Experience Name</InputLabel>
        <OutlinedInput
          id="experience-name"
          placeholder="Experience Name"
          value={newExperience?.name || ''}
          onChange={handleChange('name')}
          labelWidth={110}
          inputProps={{maxLength: 50}}
        />
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="experience-description">Description</InputLabel>
        <OutlinedInput
          id="experience-description"
          placeholder="Description"
          value={newExperience?.description || ''}
          onChange={handleChange('description')}
          labelWidth={70}
          inputProps={{maxLength: 280}}
          multiline
        />
      </FormControl>

      <FormControl fullWidth variant="outlined" style={{position: 'relative', zIndex: 100}}>
        <InputLabel htmlFor="experience-picture" shrink={true} className={styles.label}>
          Picture
        </InputLabel>
        <Dropzone
          onImageSelected={handleImageUpload}
          value={image}
          maxSize={3}
          isEdit={isEdit ? isEdit : type ? true : false}
          editorType={type}
        />
        <ShowIf condition={isLoading}>
          <div className={styles.loading}>
            <CircularProgress size={32} color="primary" />
          </div>
        </ShowIf>
      </FormControl>

      <Autocomplete<string, true, true, true>
        id="experience-tags-include"
        freeSolo
        multiple
        value={newExperience.allowedTags ?? []}
        options={tags.map(tag => tag.id).filter(tag => !newExperience.allowedTags.includes(tag))}
        disableClearable
        onChange={(event, value, reason) => {
          handleTagsChange(event, value, reason, TagsProps.ALLOWED);
        }}
        onInputChange={(event, value) => {
          handleTagsInputChange(event, value, TagsProps.ALLOWED);
        }}
        getOptionLabel={option => `#${option}`}
        renderInput={params => (
          <TextField
            {...params}
            label="Included tags"
            variant="outlined"
            placeholder={
              newExperience.allowedTags.length === 0 ? 'topic you want to follow' : undefined
            }
            onChange={handleSearchTags}
            InputProps={{
              ...params.InputProps,
              endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
            }}
          />
        )}
      />

      <Autocomplete
        id="experience-tags-exclude"
        freeSolo
        multiple
        value={newExperience?.prohibitedTags ?? []}
        options={tags
          .map(tag => tag.id)
          .filter(tag => !newExperience.prohibitedTags?.includes(tag))}
        disableClearable
        onChange={(event, value, reason) => {
          handleTagsChange(event, value, reason, TagsProps.PROHIBITED);
        }}
        onInputChange={(event, value) => {
          handleTagsInputChange(event, value, TagsProps.PROHIBITED);
        }}
        getOptionLabel={option => `#${option}`}
        renderInput={params => (
          <TextField
            {...params}
            label="Excluded tags"
            variant="outlined"
            placeholder={
              newExperience.prohibitedTags?.length === 0 ? 'topic you want to exclude' : undefined
            }
            onChange={handleSearchTags}
            InputProps={{
              ...params.InputProps,
              endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
            }}
          />
        )}
      />

      <Autocomplete
        id="experience-people"
        className={styles.people}
        value={(newExperience?.people as People[]) ?? []}
        multiple
        options={people}
        getOptionSelected={(option, value) => option.id === value.id}
        filterSelectedOptions={true}
        getOptionLabel={option => option.name}
        disableClearable
        autoHighlight={false}
        popupIcon={<SvgIcon component={SearchIcon} viewBox={'0 0 20 20'} />}
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
          if (option.id === '') return null;
          return (
            <div className={styles.option}>
              <ListItemPeopleComponent
                id="selectable-experience-list-item"
                title={option.name}
                subtitle={<Typography variant="caption">@{option.username}</Typography>}
                avatar={option.profilePictureURL}
                platform={option.platform}
                action={
                  <IconButton className={styles.removePeople}>
                    {state.selected ? (
                      <SvgIcon component={XCircleIcon} color="error" viewBox={'0 0 20 20'} />
                    ) : (
                      <SvgIcon component={PlusCircleIcon} viewBox={'0 0 20 20'} />
                    )}
                  </IconButton>
                }
              />
            </div>
          );
        }}
      />

      <div className={styles.preview}>
        {newExperience.people
          .filter(people => !isEmpty(people.id))
          .map(people => (
            <ListItemPeopleComponent
              id="selected-experience-list-item"
              key={people.id}
              title={people.name}
              subtitle={<Typography variant="caption">@{people.username}</Typography>}
              avatar={people.profilePictureURL}
              platform={people.platform}
              action={
                <IconButton onClick={removeSelectedPeople(people)}>
                  <SvgIcon component={XCircleIcon} color="error" viewBox={'0 0 20 20'} />
                </IconButton>
              }
            />
          ))}
      </div>
      <FormControl fullWidth variant="outlined">
        <Button
          disabled={!isDetailChanged || !isValidExperience()}
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          onClick={saveExperience}>
          {renderLabelButton()}
        </Button>
      </FormControl>
    </div>
  );
};
