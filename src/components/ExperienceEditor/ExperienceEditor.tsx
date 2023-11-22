import {
  SearchIcon,
  XCircleIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  CogIcon,
  ChevronUpIcon,
} from '@heroicons/react/solid';

import React, { useState, useEffect, useRef } from 'react';
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
import { BasicExperienceEditor } from './BasicExperienceEditor';
import { AdminExperienceEditor } from './ExperienceAdminEditor';
import { ExperienceAdditionalEditor } from './ExperienceAdditionalEditor';

type ExperienceEditorProps = {
  type?: 'Clone' | 'Edit' | 'Create';
  isEdit?: boolean;
  experience?: ExperienceProps;
  tags: Tag[];
  people: People[];
  onSearchTags: (query: string) => void;
  onSearchPeople: (query: string) => void;
  onSave: (experience: ExperienceProps) => void;
  onImageUpload: (files: File[]) => Promise<string>;
  onSearchUser?: (query: string) => void;
  users?: User[];
  quick?: boolean;
  showAdvance?: boolean;
  experienceVisibility?: VisibilityItem;
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

export const ExperienceEditor: React.FC<ExperienceEditorProps> = props => {
  const {
    type = 'Create',
    experience = DEFAULT_EXPERIENCE,
    people,
    tags,
    onSave,
    onImageUpload,
    onSearchTags,
    onSearchPeople,
    onSearchUser,
    users,
    quick = false,
    showAdvance = false,
    experienceVisibility,
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
  const [image, setImage] = useState<string | undefined>(
    experience?.experienceImageURL,
  );
  const [, setDetailChanged] = useState<boolean>(false);
  const [stage, setStage] = useState<Number>(1);
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
  const [showAdvanceSetting, setShowAdvanceSetting] =
    useState<boolean>(showAdvance);

  useEffect(() => {
    const experienceId = router.query.experienceId as string | null;
    if (experienceId) {
      setExperienceId(experienceId);
      loadPostExperience(experienceId);
    }
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      validateExperience();
    }
  }, [isSubmitted, newExperience]);

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
      setNewExperience({ ...newExperience, experienceImageURL: url });
    } else {
      setNewExperience({ ...newExperience, experienceImageURL: undefined });
    }

    setDetailChanged(true);
  };

  const handleChange =
    (field: keyof ExperienceProps) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const onStage = (value: Number) => {
    setStage(value);
  }

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
        people: [
          ...people,
          ...value.filter(option => people.indexOf(option) === -1),
        ],
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

  const validateExperience = (): boolean => {
    const validName = newExperience.name.length > 0;
    // const validPicture = Boolean(newExperience.experienceImageURL);
    const validTags = newExperience.allowedTags.length >= 0;
    const validPeople =
      newExperience.people.filter(people => !isEmpty(people.id)).length >= 0;
    const validSelectedUserIds =
      selectedVisibility && selectedVisibility?.id === 'selected_user'
        ? selectedUserIds.length > 0
        : !isEmpty(selectedVisibility?.id);
    const validVisibility = !isEmpty(selectedVisibility?.id);

    setErrors({
      name: !validName,
      picture: false,
      tags: !validTags,
      people: !validPeople,
      visibility: !validVisibility,
      selectedUserId: !validSelectedUserIds,
    });

    return (
      validName &&
      validTags &&
      validPeople &&
      validVisibility &&
      validSelectedUserIds
    );
  };

  const saveExperience = () => {
    setIsSubmitted(true);

    const valid = validateExperience();

    if (valid) {
      onSave(newExperience);
    } else {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleNextPagePosts = () => {
    if (experienceId) {
      loadNextPostExperience(experienceId);
    }
  };

  const handleRemoveFromExperience = (post: Post) => {
    loadExperiencePostList(post.id, postsExperiences => {
      const tmpListExperience: string[] = [];
      postsExperiences.map(item => {
        if (item.posts) {
          tmpListExperience.push(item.id);
        }
      });
      if (experienceId) {
        const indexExperience = tmpListExperience.indexOf(experienceId);
        if (indexExperience > -1) {
          tmpListExperience.splice(indexExperience, 1);
        }
        addPostsToExperience(post.id, tmpListExperience, () => {
          loadPostExperience(experienceId);
        });
      }
    });
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
    setSelectedVisibility(value);
    setNewExperience(prevExperience => ({
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
      setSelectedUserIds([
        ...people,
        ...value.filter(option => people.indexOf(option) === -1),
      ]);
      clearSearchedUser();
      clearUsers();
    }

    setDetailChanged(true);
  };

  const removeVisibilityPeople = (selected: User) => () => {
    setSelectedUserIds(
      selectedUserIds
        ? selectedUserIds.filter(people => people.id != selected.id)
        : [],
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

  useEffect(() => {
    mappingUserIds();
    setDetailChanged(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserIds, experience]);

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

  React.useEffect(() => {
    getSelectedIds(experience?.selectedUserIds);
  }, [experience, pageUserIds]);

  useEffect(() => {
    if (experience) {
      const visibility = visibilityList.find(
        option => option.id === experience?.visibility,
      );
      setSelectedVisibility(visibility);

      getSelectedIds(experience?.selectedUserIds);
    }
  }, [experience]);

  const handleAdvanceSetting = () => {
    setShowAdvanceSetting(!showAdvanceSetting);
  };

  if (stage === 1) {return (
    <BasicExperienceEditor
      onSave={onSave}
      onStage={onStage}
      onImageUpload={onImageUpload}
      onSearchUser={onSearchUser}
      users={users}
    />

  );}

  if (stage === 2) {
    return (
      <AdminExperienceEditor
        onSave={onSave}
        onStage={onStage}
        onImageUpload={onImageUpload}
        onSearchUser={onSearchUser}
        users={users}
      />
    )
  }

  if (stage === 3) {
    return (
      <ExperienceAdditionalEditor
        onSave={onSave}
        onStage={onStage}
        onSearchTags={onSearchTags}
        tags={tags}
        people={people}
        onSearchPeople={onSearchPeople}
      />
    )
  }
};
