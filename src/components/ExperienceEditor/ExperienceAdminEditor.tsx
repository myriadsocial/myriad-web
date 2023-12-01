import {
  SearchIcon,
  XCircleIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  CogIcon,
  ChevronUpIcon,
} from '@heroicons/react/solid';

import React, { useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';

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

import {
  ExperienceProps,
  VisibilityItem,
  Tag,
  SelectedUserIds,
} from '../../interfaces/experience';
import { People } from '../../interfaces/people';
import { PostDetailExperience } from '../PostDetailExperience/PostDetailExperience';
import { Dropzone } from '../atoms/Dropzone';
import { ListItemPeopleComponent } from '../atoms/ListItem/ListItemPeople';
import { Loading } from '../atoms/Loading';
import ShowIf from '../common/show-if.component';
import { useStyles } from './Experience.styles';

import { debounce, isEmpty } from 'lodash';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { useSearchHook } from 'src/hooks/use-search.hooks';
import { Post } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { UserState } from 'src/reducers/user/reducer';

type AdminExperienceEditorProps = {
  type?: 'Clone' | 'Edit' | 'Create';
  isEdit?: boolean;
  experience?: ExperienceProps;
  onStage: (value: number) => void;
  onSearchUser?: (query: string) => void;
  users?: User[];
  quick?: boolean;
  showAdvance?: boolean;
  experienceVisibility?: VisibilityItem;
  editors: User[];
  setEditors: (editors: User[]) => void;
  onExperience: (value: any) => void;
};

const DEFAULT_EXPERIENCE: ExperienceProps = {
  name: '',
  allowedTags: [],
  people: [],
  prohibitedTags: [],
  visibility: '',
  selectedUserIds: [],
};

export const AdminExperienceEditor: React.FC<AdminExperienceEditorProps> =
  props => {
    const {
      type = 'Create',
      experience = DEFAULT_EXPERIENCE,
      onSearchUser,
      users,
      quick = false,
      showAdvance = false,
      experienceVisibility,
      onStage,
      editors,
      setEditors,
      onExperience,
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
    const { clearUsers } = useSearchHook();

    const ref = useRef(null);
    const { anonymous, user } = useSelector<RootState, UserState>(
      state => state.userState,
    );
    const [experienceId, setExperienceId] = useState<string | undefined>();
    const [newExperience, setNewExperience] =
      useState<ExperienceProps>(experience);
    const [, setDetailChanged] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState<boolean>(false);
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

    const handleBack = () => {
      onExperience(prevExperience => ({
        ...prevExperience,
        editorsId: editors.map(user => user.id),
      }));
      onStage(1);
    };

    const handleNext = () => {
      onExperience(prevExperience => ({
        ...prevExperience,
        editorsId: editors.map(user => user.id),
      }));
      onStage(3);
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

    const handleEditorsPeopleChange = (
      // eslint-disable-next-line @typescript-eslint/ban-types
      event: React.ChangeEvent<{}>,
      value: User[],
      reason: AutocompleteChangeReason,
    ) => {
      const people = editors ? editors : [];
      console.log({ value });
      if (reason === 'select-option') {
        setEditors([
          ...people,
          ...value.filter(option => people.indexOf(option) === -1),
        ]);
        clearSearchedUser();
        clearUsers();
      }

      // setDetailChanged(true);
    };

    const removeEditorsPeople = (selected: User) => () => {
      setEditors(
        editors ? editors.filter(people => people.id != selected.id) : [],
      );

      setDetailChanged(true);
    };

    const mappingUserIds = () => {
      console.log({ selectedVisibility });
      if (selectedVisibility?.id === 'selected_user') {
        const timestamp = Date.now();
        const mapIds = Object.values(
          selectedUserIds.map(option => {
            return {
              userId: option.id,
              addedAt: timestamp,
            };
          }),
        );
        setNewExperience(prevExperience => ({
          ...prevExperience,
          selectedUserIds: mapIds,
        }));
      } else {
        setNewExperience(prevExperience => ({
          ...prevExperience,
          selectedUserIds: [],
        }));
      }
    };

    const getSelectedIds = async (selected: SelectedUserIds[]) => {
      setIsLoadingSelectedUser(true);
      const userIds = selected.map(e => e.userId);
      const response = await UserAPI.getUserByIds(userIds, pageUserIds);
      setSelectedUserIds([
        ...selectedUserIds,
        ...(response?.data as unknown as User[]),
      ]);
      setIsLoadingSelectedUser(false);
      if (pageUserIds < response.meta.totalPageCount)
        setPageUserIds(pageUserIds + 1);
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
                onClick={handleNext}>
                Next
              </Button>
            </FormControl>
          </div>
        </ShowIf>

        <div className={styles.content}>
          <div className={styles.row2}>
            <>
              <Autocomplete
                id="experience-editor-people"
                onBlur={clearUsers}
                className={styles.people}
                value={(editors as User[]) ?? []}
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
                onChange={handleEditorsPeopleChange}
                renderTags={() => null}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={errors.selectedUserId}
                    label={i18n.t('Experience.Editor.Placeholder_6')}
                    placeholder={i18n.t('Experience.Editor.Placeholder_6')}
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
                  {editors
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
                          <IconButton onClick={removeEditorsPeople(people)}>
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
          </div>
        </div>
      </div>
    );
  };
