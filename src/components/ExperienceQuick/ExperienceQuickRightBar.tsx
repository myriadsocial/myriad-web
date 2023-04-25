import React, { useState } from 'react';

import { useRouter } from 'next/router';

import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputBase,
  Typography,
} from '@material-ui/core';

import { ExperienceQuickContainer } from './ExperienceQuick.container';
import { useStyles } from './ExperienceQuick.style';

import { DropdownMenu } from 'components/atoms/DropdownMenu';
import { Dropzone } from 'components/atoms/Dropzone';
import { PromptComponent } from 'components/atoms/Prompt/prompt.component';
import ShowIf from 'components/common/show-if.component';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { useUpload } from 'src/hooks/use-upload.hook';
import { useUserHook } from 'src/hooks/use-user.hook';
import { ExperienceProps, VisibilityItem } from 'src/interfaces/experience';
import i18n from 'src/locale';

type ExperienceQuickRightBarType = {
  onClose: () => void;
  onSuccess: () => void;
};

const DEFAULT_EXPERIENCE: ExperienceProps = {
  name: '',
  allowedTags: [],
  people: [],
  prohibitedTags: [],
  visibility: 'public',
  selectedUserIds: [],
};

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

const ExperienceQuickRightBar: React.FC<ExperienceQuickRightBarType> =
  props => {
    const { onClose, onSuccess } = props;
    const styles = useStyles();

    const router = useRouter();

    const { user } = useUserHook();
    const { saveExperience } = useExperienceHook();
    const { uploadImage } = useUpload();

    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [newExperience, setNewExperience] =
      useState<ExperienceProps>(DEFAULT_EXPERIENCE);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [selectedVisibility, setSelectedVisibility] =
      useState<VisibilityItem>(visibilityList[0]);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [showAdvanceSetting, setShowAdvanceSetting] =
      useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewExperience({ ...newExperience, name: event.target.value });
    };

    const handleVisibility = selected => {
      setNewExperience({ ...newExperience, visibility: selected });
      setSelectedVisibility(visibilityList.find(v => v.id === selected));
    };

    const onImageUpload = async (files: File[]) => {
      const url = await uploadImage(files[0]);

      return url ?? '';
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
    };

    const handleOpenAdvanceSetting = () => {
      setShowAdvanceSetting(true);
    };

    const handleCloseAdvanceSetting = () => {
      onClose();
      setNewExperience(DEFAULT_EXPERIENCE);
      setShowAdvanceSetting(false);
    };

    const onSave = (attributes: ExperienceProps) => {
      saveExperience(attributes, (experienceId: string) => {
        onSuccess();
        handleShowPrompt();
      });
    };

    const handleShowPrompt = () => {
      onClose();
      setShowPrompt(!showPrompt);
    };

    const handleCreatePost = () => {
      setShowPrompt(false);
      router.replace('/?createPost=true');
    };

    const disabledSave = newExperience.name === '' || isLoading;

    return (
      <>
        <ShowIf condition={!showAdvanceSetting}>
          <Card className={styles.root}>
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

                <Grid
                  container
                  alignItems="center"
                  className={styles.filterBox}>
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
            </Grid>

            <Grid
              container
              justifyContent="space-between"
              wrap="nowrap"
              style={{ marginTop: 14 }}>
              <Typography
                variant={'h6'}
                color={isLoading ? 'textSecondary' : 'primary'}
                component="div"
                className={styles.action}
                onClick={() => (isLoading ? null : handleOpenAdvanceSetting())}>
                {i18n.t(`Experience.Editor.Btn.AdvancedSettings`)}
              </Typography>
              <div>
                <Typography
                  variant={'h6'}
                  color={disabledSave ? 'textSecondary' : 'primary'}
                  component="span"
                  className={styles.action}
                  style={{ marginRight: 20 }}
                  onClick={() => (disabledSave ? null : onSave(newExperience))}>
                  {i18n.t(`General.Save`)}
                </Typography>
                <Typography
                  variant={'h6'}
                  color={'error'}
                  component="span"
                  className={styles.action}
                  onClick={handleCloseAdvanceSetting}>
                  {i18n.t(`General.Cancel`)}
                </Typography>
              </div>
            </Grid>
          </Card>
        </ShowIf>

        <ExperienceQuickContainer
          open={showAdvanceSetting}
          onSuccess={onSuccess}
          experience={newExperience}
          onClose={handleCloseAdvanceSetting}
          selectedVisibility={selectedVisibility}
        />

        <PromptComponent
          icon="success"
          open={showPrompt}
          onCancel={handleShowPrompt}
          title={i18n.t('Experience.Create.Success.Title')}
          subtitle={i18n.t('Experience.Create.Success.Subtitle')}>
          <Grid
            container
            justifyContent="space-around"
            style={{ marginTop: 32 }}>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleShowPrompt}>
              {i18n.t('General.Cancel')}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleCreatePost}>
              {i18n.t('Experience.Create.Success.Btn')}
            </Button>
          </Grid>
        </PromptComponent>
      </>
    );
  };

export default ExperienceQuickRightBar;
