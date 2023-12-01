import React, { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';

import { Button } from '@material-ui/core';

import {
  ExperienceProps,
  VisibilityItem,
  Tag,
  SelectedUserIds,
} from '../../interfaces/experience';
import { People } from '../../interfaces/people';
import ShowIf from '../common/show-if.component';
import { BasicExperienceEditor } from './BasicExperienceEditor';
import { useStyles } from './Experience.styles';
import { ExperienceAdditionalEditor } from './ExperienceAdditionalEditor';
import { AdminExperienceEditor } from './ExperienceAdminEditor';

import { isEmpty } from 'lodash';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { User } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';

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

  const { loadPostExperience } = useExperienceHook();
  const router = useRouter();

  const ref = useRef(null);
  const [, setExperienceId] = useState<string | undefined>();
  const [newExperience, setNewExperience] =
    useState<ExperienceProps>(experience);
  const [image, setImage] = useState<string | undefined>(
    experience?.experienceImageURL,
  );
  const [, setDetailChanged] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(1);
  const [, setIsloading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedVisibility, setSelectedVisibility] =
    useState<VisibilityItem>(experienceVisibility);
  const [selectedUserIds, setSelectedUserIds] = useState<User[]>([]);
  const [editors, setEditors] = useState<User[]>([]);
  const [pageUserIds, setPageUserIds] = React.useState<number>(1);
  const [, setIsLoadingSelectedUser] = useState<boolean>(false);
  const [, setErrors] = useState({
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

  const onStage = (value: number) => {
    setStage(value);
  };

  const validateExperience = (): boolean => {
    const validName = newExperience.name.length > 0;
    // const validPicture = Boolean(newExperience.experienceImageURL);
    const validTags = newExperience.allowedTags.length >= 0;
    const validPeople =
      newExperience.people.filter(people => !isEmpty(people.id)).length >= 0;
    const validSelectedUserIds =
      newExperience.visibility === 'selected_user'
        ? selectedUserIds.length > 0
        : !isEmpty(newExperience.visibility);
    const validVisibility = !isEmpty(newExperience.visibility);

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
      console.log(newExperience);
      onSave(newExperience);
    } else {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
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

  const onExperience = value => {
    setNewExperience(value);
  };

  const onVisibility = value => {
    setSelectedVisibility(value);
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

  if (stage === 1) {
    return (
      <BasicExperienceEditor
        onStage={onStage}
        onSearchUser={onSearchUser}
        users={users}
        onExperience={onExperience}
        newExperience={newExperience}
        onVisibility={onVisibility}
        selectedVisibility={selectedVisibility}
        image={image}
        handleImageUpload={handleImageUpload}
        selectedUserIds={selectedUserIds}
        onSelectedUserIds={setSelectedUserIds}
      />
    );
  }

  if (stage === 2) {
    return (
      <AdminExperienceEditor
        onStage={onStage}
        onSearchUser={onSearchUser}
        users={users}
        editors={editors}
        setEditors={setEditors}
        onExperience={onExperience}
      />
    );
  }

  if (stage === 3) {
    return (
      <ExperienceAdditionalEditor
        onStage={onStage}
        onSearchTags={onSearchTags}
        tags={tags}
        people={people}
        onSearchPeople={onSearchPeople}
        onExperience={onExperience}
        newExperience={newExperience}
        saveExperience={saveExperience}
      />
    );
  }

  return (
    <>
      <ShowIf condition={quick}>
        <div className={styles.header}>
          <ShowIf condition={!showAdvanceSetting}>
            <Button
              color="primary"
              variant="outlined"
              style={{ width: 'auto' }}
              onClick={handleAdvanceSetting}>
              {i18n.t(`Experience.Editor.Btn.AdvancedSettings`)}
            </Button>
          </ShowIf>
          <Button
            color="primary"
            variant="contained"
            style={{ width: 'auto', marginLeft: 'auto' }}
            onClick={saveExperience}>
            {i18n.t(`Experience.Editor.Btn.${type}`)}
          </Button>
        </div>
      </ShowIf>
    </>
  );
};
