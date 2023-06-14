import React, { useState, useEffect, useRef } from 'react';

import {
  CardContent,
  FormControl,
  Grid,
  InputBase,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  ExperienceProps,
  VisibilityItem,
  SelectedUserIds,
  Tag,
} from '../../interfaces/experience';
import { Dropzone } from '../atoms/Dropzone';
import ShowIf from '../common/show-if.component';
import { useStyles } from './Experience.styles';

import { DropdownMenu } from 'components/atoms/DropdownMenu';
import { isEmpty } from 'lodash';
import { People } from 'src/interfaces/people';
import { User } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';

type ExperienceEditorProps = {
  type?: 'Clone' | 'Edit' | 'Create';
  isEdit?: boolean;
  experience?: ExperienceProps;
  tags?: Tag[];
  people?: People[];
  onSearchTags?: (query: string) => void;
  onSearchPeople?: (query: string) => void;
  onSave: (experience: ExperienceProps) => void;
  onImageUpload?: (files: File[]) => Promise<string>;
  onSearchUser?: (query: string) => void;
  users?: User[];
  user?: User;
  onCancel?: () => void;
};

const DEFAULT_EXPERIENCE: ExperienceProps = {
  name: '',
  allowedTags: [],
  people: [],
  prohibitedTags: [],
  visibility: 'public',
  selectedUserIds: [],
};

export const ExperienceTimelinePost: React.FC<ExperienceEditorProps> =
  props => {
    const {
      experience = DEFAULT_EXPERIENCE,
      onSave,
      onImageUpload,
      user,
      onCancel,
    } = props;
    const styles = useStyles();

    const ref = useRef(null);
    const visibilityList = [
      {
        id: 'public',
        title: i18n.t('Experience.Editor.Visibility.Public'),
        name: i18n.t('Experience.Editor.Visibility.Public'),
      },
      {
        id: 'private',
        title: i18n.t('Experience.Editor.Visibility.OnlyMe'),
        name: i18n.t('Experience.Editor.Visibility.OnlyMe'),
      },
      {
        id: 'friend',
        title: i18n.t('Experience.Editor.Visibility.Friend_Only'),
        name: i18n.t('Experience.Editor.Visibility.Friend_Only'),
      },
    ];
    const [newExperience, setNewExperience] =
      useState<ExperienceProps>(experience);
    const [image, setImage] = useState<string | undefined>(
      experience.experienceImageURL,
    );
    const [, setDetailChanged] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [selectedVisibility, setSelectedVisibility] =
      useState<VisibilityItem>();
    const [selectedUserIds, setSelectedUserIds] = useState<User[]>([]);
    const [pageUserIds, setPageUserIds] = React.useState<number>(1);

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewExperience({ ...newExperience, name: event.target.value });
    };
    const handleVisibility = selected => {
      setNewExperience({ ...newExperience, visibility: selected ?? 'public' });
      setSelectedVisibility(visibilityList.find(v => v.id === selected));
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
      return validName && validTags && validPeople && validSelectedUserIds;
    };

    const handleEnabledSave = () => {
      return newExperience.name.length > 0 && image;
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

    const mappingUserIds = () => {
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
      const userIds = selected.map(e => e.userId);
      const response = await UserAPI.getUserByIds(userIds, pageUserIds);
      setSelectedUserIds([
        ...selectedUserIds,
        ...(response?.data as unknown as User[]),
      ]);
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

    return (
      <div className={styles.root} ref={ref}>
        <Grid container justifyContent="space-between" wrap="nowrap">
          <div>
            <Dropzone
              onImageSelected={handleImageUpload}
              value={image}
              border="solid"
              maxSize={3}
              width={68}
              height={68}
              usage="experience"
            />
            <ShowIf condition={isLoading}>
              <div className={styles.loading}>
                <CircularProgress size={10} color="primary" />
              </div>
            </ShowIf>
          </div>

          <CardContent classes={{ root: styles.cardContent }}>
            <InputBase
              className={styles.inputText}
              value={newExperience.name}
              onChange={handleChange}
              placeholder={'Add Timeline Name...'}
              type="search"
              style={{ display: 'flex' }}
              {...props}
            />
            <div style={{ padding: '1.5px 0' }}>
              <Typography
                variant="caption"
                color="primary"
                className={styles.subtitle}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {` ${i18n.t('Experience.List.You')}`}
              </Typography>
            </div>

            <Grid container alignItems="center" className={styles.filterBox}>
              <DropdownMenu
                title={'Visibility'}
                options={visibilityList}
                onChange={handleVisibility}
                marginTop={false}
                marginBottom={false}
                experience
              />
            </Grid>
          </CardContent>

          <FormControl
            classes={{ root: styles.formControl }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginLeft: 'auto',
            }}>
            {handleEnabledSave() ? (
              <Typography
                variant="h5"
                color="primary"
                onClick={saveExperience}
                style={{ cursor: 'pointer' }}>
                Save
              </Typography>
            ) : (
              <Typography
                variant="h5"
                color="textSecondary"
                style={{ cursor: 'not-allowed' }}>
                Save
              </Typography>
            )}
            <Typography
              variant="h5"
              style={{ color: 'red', marginLeft: 10, cursor: 'pointer' }}
              onClick={onCancel}>
              Cancel
            </Typography>
          </FormControl>
        </Grid>
      </div>
    );
  };
