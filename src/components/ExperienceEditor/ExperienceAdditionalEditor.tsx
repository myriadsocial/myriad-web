import {
  SearchIcon,
  XCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/solid';

import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import {
  Button,
  FormControl,
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

import {
  ExperienceProps,
  VisibilityItem,
  Tag,
  SelectedUserIds,
} from '../../interfaces/experience';
import { People } from '../../interfaces/people';
import { ListItemPeopleComponent } from '../atoms/ListItem/ListItemPeople';
import ShowIf from '../common/show-if.component';
import { useStyles } from './Experience.styles';

import { debounce, isEmpty } from 'lodash';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { User } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { UserState } from 'src/reducers/user/reducer';

type ExperienceAdditionalEditorProps = {
  type?: 'Clone' | 'Edit' | 'Create';
  isEdit?: boolean;
  experience?: ExperienceProps;
  tags: Tag[];
  people: People[];
  onSearchTags: (query: string) => void;
  onSearchPeople: (query: string) => void;
  onSave: (experience: ExperienceProps) => void;
  onExperience: (value: any) => void;
  onStage: (value: number) => void;
  quick?: boolean;
  showAdvance?: boolean;
  experienceVisibility?: VisibilityItem;
  newExperience: ExperienceProps;
  saveExperience: () => void;
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
  visibility: '',
  selectedUserIds: [],
};

export const ExperienceAdditionalEditor: React.FC<ExperienceAdditionalEditorProps> =
  props => {
    const {
      type = 'Create',
      experience = DEFAULT_EXPERIENCE,
      people,
      tags,
      onSave,
      onSearchTags,
      onSearchPeople,
      quick = false,
      showAdvance = false,
      experienceVisibility,
      onStage,
      onExperience,
      newExperience,
      saveExperience,
    } = props;
    const styles = useStyles({ quick });

    const {
      experiencePosts,
      hasMore,
      loadPostExperience,
      loadNextPostExperience,
      loadExperiencePostList,
      addPostsToExperience,
    } = useExperienceHook();
    const router = useRouter();

    const ref = useRef(null);
    const { anonymous, user } = useSelector<RootState, UserState>(
      state => state.userState,
    );
    const [experienceId, setExperienceId] = useState<string | undefined>();
    const [, setDetailChanged] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [selectedVisibility, setSelectedVisibility] =
      useState<VisibilityItem>(experienceVisibility);
    const [selectedUserIds, setSelectedUserIds] = useState<User[]>([]);
    const [pageUserIds, setPageUserIds] = React.useState<number>(1);
    const [isLoadingSelectedUser, setIsLoadingSelectedUser] =
      useState<boolean>(false);
    const [errors, setErrors] = useState({
      name: false,
      picture: false,
      tags: false,
      people: false,
      visibility: false,
      selectedUserId: false,
    });
    const [showAdvanceSetting, setShowAdvanceSetting] =
      useState<boolean>(showAdvance);

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
        (data.filter(
          tag =>
            !experience?.prohibitedTags ||
            !experience.prohibitedTags.includes(tag),
        ).length > 0 ||
          experience?.prohibitedTags?.length !== data.length);
      const allowedTagsChanged =
        type === TagsProps.ALLOWED &&
        (data.filter(tag => !experience.allowedTags.includes(tag)).length > 0 ||
          data.length !== experience.allowedTags.length);

      setDetailChanged(prohibitedTagsChanged || allowedTagsChanged);

      if (reason === 'remove-option') {
        if (type === TagsProps.ALLOWED) {
          onExperience(prevExperience => ({
            ...prevExperience,
            allowedTags: data,
          }));
        } else if (type === TagsProps.PROHIBITED) {
          onExperience(prevExperience => ({
            ...prevExperience,
            prohibitedTags: data,
          }));
        }
      }

      if (reason === 'create-option') {
        if (type === TagsProps.ALLOWED) {
          onExperience(prevExperience => ({
            ...prevExperience,
            allowedTags: data,
          }));
        } else if (type === TagsProps.PROHIBITED) {
          onExperience(prevExperience => ({
            ...prevExperience,
            prohibitedTags: data,
          }));
        }
      }

      if (reason === 'select-option') {
        if (type === TagsProps.ALLOWED) {
          onExperience(prevExperience => ({
            ...prevExperience,
            allowedTags: data,
          }));
        } else if (type === TagsProps.PROHIBITED) {
          onExperience(prevExperience => ({
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
        onExperience(prevExperience => ({
          ...prevExperience,
          people: [
            ...people,
            ...value.filter(option => people.indexOf(option) === -1),
          ],
        }));
        clearSearchedPeople();
      }

      setDetailChanged(true);
    };

    const handleBack = () => {
      onStage(2);
    };

    return (
      <div className={styles.root} ref={ref}>
        <ShowIf condition={!quick}>
          <div className={styles.header}>
            <FormControl classes={{ root: styles.formControl }}>
              <Button
                color="primary"
                variant="contained"
                style={{ width: 'auto' }}
                onClick={handleBack}>
                Back
              </Button>
            </FormControl>
            <div>
              <Typography variant="h4">
                {i18n.t(`Experience.Editor.Header`)}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {i18n.t(`Experience.Editor.Sub_Header`)}
              </Typography>
            </div>
            <FormControl classes={{ root: styles.formControl }}>
              <Button
                color="primary"
                variant="contained"
                style={{ width: 'auto' }}
                onClick={saveExperience}>
                {i18n.t(`Experience.Editor.Btn.${type}`)}
              </Button>
            </FormControl>
          </div>
        </ShowIf>

        <div className={styles.content}>
          <div className={styles.row2}>
            <Autocomplete<string, true, true, true>
              className={styles.fill}
              id="experience-tags-include"
              freeSolo
              multiple
              value={newExperience.allowedTags ?? []}
              options={tags
                .map(tag => tag.id)
                .filter(tag => !newExperience.allowedTags.includes(tag))}
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
                  error={errors.tags}
                  label={i18n.t('Experience.Editor.Label_1')}
                  variant="outlined"
                  placeholder={
                    newExperience.allowedTags.length === 0
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
                  label={i18n.t('Experience.Editor.Label_2')}
                  variant="outlined"
                  placeholder={
                    newExperience.prohibitedTags?.length === 0
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
              value={(newExperience?.people as People[]) ?? []}
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
                  error={errors.people}
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
                        <Typography variant="caption">
                          @{option.username}
                        </Typography>
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
          </div>
        </div>
      </div>
    );
  };
