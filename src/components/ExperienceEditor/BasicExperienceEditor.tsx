import {
  SearchIcon,
  XCircleIcon,
  PlusCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid';

import React, { useState, useRef } from 'react';

import {
  Button,
  FormControl,
  FormHelperText,
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

import { ExperienceProps, VisibilityItem } from '../../interfaces/experience';
import { Dropzone } from '../atoms/Dropzone';
import { ListItemPeopleComponent } from '../atoms/ListItem/ListItemPeople';
import { Loading } from '../atoms/Loading';
import ShowIf from '../common/show-if.component';
import { useStyles } from './Experience.styles';

import { debounce, isEmpty } from 'lodash';
import { useSearchHook } from 'src/hooks/use-search.hooks';
import { User } from 'src/interfaces/user';
import i18n from 'src/locale';

type BasicExperienceEditorProps = {
  experience?: ExperienceProps;
  handleImageUpload: (files: File[]) => Promise<void>;
  onStage: (value: number) => void;
  onExperience: (value: any) => void;
  onSearchUser?: (query: string) => void;
  users?: User[];
  quick?: boolean;
  experienceVisibility?: VisibilityItem;
  newExperience: ExperienceProps;
  onVisibility: (value: any) => void;
  image: string;
  selectedVisibility: VisibilityItem;
  selectedUserIds: User[];
  onSelectedUserIds: (value: any) => void;
};

const DEFAULT_EXPERIENCE: ExperienceProps = {
  name: '',
  allowedTags: [],
  people: [],
  prohibitedTags: [],
  visibility: '',
  selectedUserIds: [],
};

export const BasicExperienceEditor: React.FC<BasicExperienceEditorProps> =
  props => {
    const {
      experience = DEFAULT_EXPERIENCE,
      handleImageUpload,
      onSearchUser,
      onStage,
      onExperience,
      users,
      quick = false,
      newExperience,
      image,
      onVisibility,
      selectedVisibility,
      selectedUserIds,
      onSelectedUserIds,
    } = props;
    const styles = useStyles({ quick });
    const { clearUsers } = useSearchHook();

    const ref = useRef(null);
    const [, setDetailChanged] = useState<boolean>(false);
    const [isLoading] = useState<boolean>(false);
    const [isLoadingSelectedUser] = useState<boolean>(false);
    const [errors] = useState({
      name: false,
      picture: false,
      tags: false,
      people: false,
      visibility: false,
      selectedUserId: false,
    });

    const handleChange =
      (field: keyof ExperienceProps) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trimStart();

        onExperience(prevExperience => ({
          ...prevExperience,
          [field]: value,
        }));

        setDetailChanged(experience[field] !== value);
      };

    const handleNext = () => {
      const number = 2;
      onStage(number);
    };

    const visibilityList: VisibilityItem[] = [
      {
        id: 'public',
        name: i18n.t('Experience.Editor.Visibility.Public'),
      },
      {
        id: 'private',
        name: i18n.t('Experience.Editor.Visibility.OnlyMe'),
      },
      {
        id: 'selected_user',
        name: i18n.t('Experience.Editor.Visibility.Custom'),
      },
      {
        id: 'friend',
        name: i18n.t('Experience.Editor.Visibility.Friend_Only'),
      },
    ];

    const handleVisibilityChange = (
      // eslint-disable-next-line @typescript-eslint/ban-types
      event: React.ChangeEvent<{}>,
      value: VisibilityItem,
      reason: AutocompleteChangeReason,
    ) => {
      onVisibility(value);
      onExperience(prevExperience => ({
        ...prevExperience,
        visibility: value?.id,
      }));

      setDetailChanged(true);
    };

    const handleSearchUser = (event: React.ChangeEvent<HTMLInputElement>) => {
      const debounceSubmit = debounce(() => {
        onSearchUser(event.target.value);
      }, 300);

      debounceSubmit();
    };

    const clearSearchedUser = () => {
      const debounceSubmit = debounce(() => {
        onSearchUser('');
      }, 300);

      debounceSubmit();
    };

    const handleVisibilityPeopleChange = (
      // eslint-disable-next-line @typescript-eslint/ban-types
      event: React.ChangeEvent<{}>,
      value: User[],
      reason: AutocompleteChangeReason,
    ) => {
      const people = selectedUserIds ? selectedUserIds : [];
      console.log({ value });
      if (reason === 'select-option') {
        onSelectedUserIds([
          ...people,
          ...value.filter(option => people.indexOf(option) === -1),
        ]);
        clearSearchedUser();
        clearUsers();
      }

      setDetailChanged(true);
    };

    const removeVisibilityPeople = (selected: User) => () => {
      onSelectedUserIds(
        selectedUserIds
          ? selectedUserIds.filter(people => people.id != selected.id)
          : [],
      );

      setDetailChanged(true);
    };

    return (
      <div className={styles.root} ref={ref}>
        <ShowIf condition={!quick}>
          <div className={styles.header}>
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
                onClick={handleNext}>
                Next
              </Button>
            </FormControl>
          </div>
        </ShowIf>

        <div className={styles.content}>
          <div className={styles.row1}>
            <FormControl
              fullWidth
              variant="outlined"
              style={{ position: 'relative', zIndex: 100 }}
              error={errors.picture}>
              <Dropzone
                error={errors.picture}
                onImageSelected={handleImageUpload}
                value={image}
                border="solid"
                maxSize={3}
                width={100}
                height={100}
                usage="experience"
                label={i18n.t('Dropzone.Btn.Exp_Add')}
              />
              <ShowIf condition={isLoading}>
                <div className={styles.loading}>
                  <CircularProgress size={32} color="primary" />
                </div>
              </ShowIf>
            </FormControl>
          </div>
          <div className={styles.row2}>
            <FormControl fullWidth variant="outlined" error={errors.name}>
              <InputLabel htmlFor="experience-name">
                {i18n.t('Experience.Editor.Subtitle_1')}
              </InputLabel>
              <OutlinedInput
                id="experience-name"
                placeholder={i18n.t('Experience.Editor.Subtitle_1')}
                value={newExperience?.name || ''}
                onChange={handleChange('name')}
                labelWidth={110}
                inputProps={{ maxLength: 50 }}
              />
              <FormHelperText id="experience-name-error">
                {i18n.t('Experience.Editor.Helper.Name')}
              </FormHelperText>
              <Typography variant="subtitle1" className={styles.counter}>
                {newExperience?.name.length ?? 0}/50
              </Typography>
            </FormControl>

            <Autocomplete
              id="experience-visibility"
              options={visibilityList}
              getOptionLabel={option => option.name}
              getOptionSelected={(option, value) => option?.id === value.id}
              autoHighlight={false}
              disableClearable
              onChange={handleVisibilityChange}
              value={selectedVisibility || null}
              popupIcon={
                <SvgIcon
                  classes={{ root: styles.fill }}
                  component={ChevronDownIcon}
                  viewBox={'0 0 20 20'}
                />
              }
              renderInput={({ inputProps, ...rest }) => (
                <TextField
                  {...rest}
                  error={errors.visibility}
                  label={i18n.t('Experience.Editor.Label_4')}
                  placeholder={i18n.t('Experience.Editor.Placeholder_4')}
                  variant="outlined"
                  inputProps={{ ...inputProps, readOnly: true }}
                />
              )}
            />

            {selectedVisibility?.id === 'selected_user' && (
              <>
                <Autocomplete
                  id="experience-custom-visibility-people"
                  onBlur={clearUsers}
                  className={styles.people}
                  value={(selectedUserIds as User[]) ?? []}
                  multiple
                  options={users}
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
                  onChange={handleVisibilityPeopleChange}
                  renderTags={() => null}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={errors.selectedUserId}
                      label={i18n.t('Experience.Editor.Placeholder_5')}
                      placeholder={i18n.t('Experience.Editor.Placeholder_5')}
                      variant="outlined"
                      onChange={handleSearchUser}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                      helperText={i18n.t('Experience.Editor.Helper.People')}
                    />
                  )}
                  renderOption={(
                    option,
                    state: AutocompleteRenderOptionState,
                  ) => {
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
                          platform={'myriad'}
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

                <div className={styles.preview}>
                  <div className={styles.customVisibility}>
                    <ShowIf condition={isLoadingSelectedUser}>
                      <Loading />
                    </ShowIf>
                    {selectedUserIds
                      .filter(people => !isEmpty(people.id))
                      .map(people => (
                        <ListItemPeopleComponent
                          id="selected-experience-list-item"
                          key={people.id}
                          title={people.name}
                          subtitle={
                            <Typography variant="caption">
                              @{people.username}
                            </Typography>
                          }
                          avatar={people.profilePictureURL}
                          platform={'myriad'}
                          action={
                            <IconButton
                              onClick={removeVisibilityPeople(people)}>
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
                </div>
              </>
            )}

            <FormControl
              fullWidth
              variant="outlined"
              style={{ position: 'relative' }}>
              <InputLabel htmlFor="experience-description">
                {i18n.t('Experience.Editor.Subtitle_2')}
              </InputLabel>
              <OutlinedInput
                id="experience-description"
                placeholder={i18n.t('Experience.Editor.Subtitle_2')}
                value={newExperience?.description || ''}
                onChange={handleChange('description')}
                labelWidth={70}
                inputProps={{ maxLength: 280 }}
                multiline
                rows={5}
              />
              <FormHelperText id="experience-description-error">
                &nbsp;
              </FormHelperText>
              <Typography variant="subtitle1" className={styles.counter}>
                {newExperience?.description?.length ?? 0}/280
              </Typography>
            </FormControl>
          </div>
        </div>
      </div>
    );
  };
