import {
  PlusCircleIcon,
  SearchIcon,
  XCircleIcon,
} from '@heroicons/react/solid';

import React, { useState } from 'react';

import {
  Button,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteRenderOptionState,
} from '@material-ui/lab';

import { useStyles } from './FormSearch.style';

import { BoxComponent } from 'components/atoms/Box';
import { ListItemPeopleComponent } from 'components/atoms/ListItem/ListItemPeople';
import ShowIf from 'components/common/show-if.component';
import { debounce, isEmpty } from 'lodash';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { DiscoverTimelineInterface } from 'src/interfaces/experience';
import { People } from 'src/interfaces/people';
import i18n from 'src/locale';

enum TagsProps {
  ALLOWED = 'allowed',
  PROHIBITED = 'prohibited',
}

export const FormSearch = () => {
  const styles = useStyles();
  const { tags, people, searchTags, searchPeople } = useExperienceHook();
  const defaultExperience = {
    name: '',
    allowedTags: [],
    prohibitedTags: [],
    people: [],
  };
  const [experience, setExperience] =
    useState<DiscoverTimelineInterface>(defaultExperience);

  const handleTagsInputChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    newValue: string,
    type: TagsProps,
  ) => {
    const options = newValue.split(/[ ,]+/);

    let tmpTags: string[] = [];
    if (type === TagsProps.ALLOWED) {
      tmpTags = experience.allowedTags;
    } else if (type === TagsProps.PROHIBITED) {
      tmpTags = experience.prohibitedTags ?? [];
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

    if (reason === 'remove-option') {
      if (type === TagsProps.ALLOWED) {
        setExperience(prevExperience => ({
          ...prevExperience,
          allowedTags: data,
        }));
      } else if (type === TagsProps.PROHIBITED) {
        setExperience(prevExperience => ({
          ...prevExperience,
          prohibitedTags: data,
        }));
      }
    }

    if (reason === 'create-option') {
      if (type === TagsProps.ALLOWED) {
        setExperience(prevExperience => ({
          ...prevExperience,
          allowedTags: data,
        }));
      } else if (type === TagsProps.PROHIBITED) {
        setExperience(prevExperience => ({
          ...prevExperience,
          prohibitedTags: data,
        }));
      }
    }

    if (reason === 'select-option') {
      if (type === TagsProps.ALLOWED) {
        setExperience(prevExperience => ({
          ...prevExperience,
          allowedTags: data,
        }));
      } else if (type === TagsProps.PROHIBITED) {
        setExperience(prevExperience => ({
          ...prevExperience,
          prohibitedTags: data,
        }));
      }
    }
  };

  const handleSearchTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    const debounceSubmit = debounce(() => {
      searchTags(event.target.value);
    }, 300);

    debounceSubmit();
  };

  const handleSearchPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
    const debounceSubmit = debounce(() => {
      searchPeople(event.target.value);
    }, 300);

    debounceSubmit();
  };

  const clearSearchedPeople = () => {
    const debounceSubmit = debounce(() => {
      searchPeople('');
    }, 300);

    debounceSubmit();
  };

  const handlePeopleChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: People[],
    reason: AutocompleteChangeReason,
  ) => {
    const people = experience?.people ? experience.people : [];
    if (reason === 'select-option') {
      setExperience(prevExperience => ({
        ...prevExperience,
        people: [
          ...people,
          ...value.filter(option => people.indexOf(option) === -1),
        ],
      }));
      clearSearchedPeople();
    }
  };

  const removeSelectedPeople = (selected: People) => () => {
    setExperience(prevExperience => ({
      ...prevExperience,
      people: prevExperience?.people
        ? prevExperience?.people.filter(people => people.id != selected.id)
        : [],
    }));
  };

  const handleSearch = () => {
    return null;
  };

  return (
    <BoxComponent radiusStr="10px">
      <Typography variant="h4">{i18n.t('Experience.New.Discover')}</Typography>

      <Autocomplete<string, true, true, true>
        className={styles.fill}
        id="experience-tags-include"
        freeSolo
        multiple
        value={experience.allowedTags ?? []}
        options={tags
          .map(tag => tag.id)
          .filter(tag => !experience.allowedTags.includes(tag))}
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
            // error={errors.tags}
            label={i18n.t('Experience.Editor.Label_1')}
            variant="outlined"
            placeholder={
              experience.allowedTags.length === 0
                ? i18n.t('Experience.Editor.Placeholder_1')
                : undefined
            }
            onChange={handleSearchTags}
            helperText={''}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      <Autocomplete
        className={styles.fill}
        id="experience-tags-exclude"
        freeSolo
        multiple
        value={experience?.prohibitedTags ?? []}
        options={tags
          .map(tag => tag.id)
          .filter(tag => !experience.prohibitedTags?.includes(tag))}
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
            label={i18n.t('Experience.Editor.Label_2')}
            variant="outlined"
            placeholder={
              experience.prohibitedTags?.length === 0
                ? i18n.t('Experience.Editor.Placeholder_2')
                : undefined
            }
            onChange={handleSearchTags}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      <Autocomplete
        id="experience-people"
        className={styles.people}
        value={(experience?.people as People[]) ?? []}
        multiple
        options={people}
        getOptionSelected={(option, value) => option.id === value.id}
        filterSelectedOptions={true}
        getOptionLabel={option => `${option.username} ${option.name}`}
        disableClearable
        autoHighlight={false}
        popupIcon={
          <SvgIcon
            classes={{ root: styles.fill }}
            component={SearchIcon}
            viewBox={'0 0 20 20'}
          />
        }
        onChange={handlePeopleChange}
        renderTags={() => null}
        renderInput={params => (
          <TextField
            {...params}
            // error={errors.people}
            label={i18n.t('Experience.Editor.Label_3')}
            placeholder={i18n.t('Experience.Editor.Placeholder_3')}
            variant="outlined"
            onChange={handleSearchPeople}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            helperText={''}
          />
        )}
        renderOption={(option, state: AutocompleteRenderOptionState) => {
          if (option.id === '') return null;
          return (
            <div className={styles.option}>
              <ListItemPeopleComponent
                id="selectable-experience-list-item"
                title={option.name}
                subtitle={
                  <Typography variant="caption">@{option.username}</Typography>
                }
                avatar={option.profilePictureURL}
                platform={option.platform}
                action={
                  <IconButton className={styles.removePeople}>
                    {state.selected ? (
                      <SvgIcon
                        classes={{ root: styles.fill }}
                        component={XCircleIcon}
                        color="error"
                        viewBox={'0 0 20 20'}
                      />
                    ) : (
                      <SvgIcon
                        classes={{ root: styles.fill }}
                        component={PlusCircleIcon}
                        viewBox={'0 0 20 20'}
                      />
                    )}
                  </IconButton>
                }
              />
            </div>
          );
        }}
      />

      <ShowIf condition={experience.people.length > 0}>
        <div className={styles.preview}>
          {experience.people
            .filter(people => !isEmpty(people.id))
            .map(people => (
              <ListItemPeopleComponent
                id="selected-experience-list-item"
                key={people.id}
                title={people.name}
                subtitle={
                  <Typography variant="caption">@{people.username}</Typography>
                }
                avatar={people.profilePictureURL}
                platform={people.platform}
                action={
                  <IconButton onClick={removeSelectedPeople(people)}>
                    <SvgIcon
                      classes={{ root: styles.fill }}
                      component={XCircleIcon}
                      color="error"
                      viewBox={'0 0 20 20'}
                    />
                  </IconButton>
                }
              />
            ))}
        </div>
      </ShowIf>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{
            width: 'max-content',
          }}
          fullWidth>
          {i18n.t('Experience.New.SearchTimeline')}
        </Button>
      </div>
    </BoxComponent>
  );
};
