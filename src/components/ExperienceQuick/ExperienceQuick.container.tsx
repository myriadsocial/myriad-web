import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { Button, Grid, useMediaQuery } from '@material-ui/core';

import { ExperienceEditor } from 'components/ExperienceEditor';
import { Modal } from 'components/atoms/Modal';
import { PromptComponent } from 'components/atoms/Prompt/prompt.component';
import debounce from 'lodash/debounce';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { useSearchHook } from 'src/hooks/use-search.hooks';
import { useUpload } from 'src/hooks/use-upload.hook';
import { ExperienceProps } from 'src/interfaces/experience';
import i18n from 'src/locale';
import theme from 'src/themes/default';

type ExperienceQuickContainerType = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const ExperienceQuickContainer: React.FC<ExperienceQuickContainerType> =
  props => {
    const { open, onClose, onSuccess } = props;
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    // TODO: separate hook for tag, people and experience
    const {
      selectedExperience,
      tags,
      people,
      saveExperience,
      searchTags,
      searchPeople,
    } = useExperienceHook();
    const { searchUsers, users } = useSearchHook();

    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const { uploadImage } = useUpload();
    const router = useRouter();

    const onImageUpload = async (files: File[]) => {
      const url = await uploadImage(files[0]);

      return url ?? '';
    };

    const onSave = (attributes: ExperienceProps) => {
      saveExperience(attributes, (experienceId: string) => {
        onSuccess();
        handleShowPrompt();
      });
    };

    const handleSearchTags = debounce((query: string) => {
      searchTags(query);
    }, 300);

    const handleSearchPeople = debounce((query: string) => {
      searchPeople(query);
    }, 300);

    const handleSearchUser = debounce((query: string) => {
      searchUsers(query);
    }, 300);

    const handleShowPrompt = () => {
      onClose();
      setShowPrompt(!showPrompt);
    };

    const handleCreatePost = () => {
      setShowPrompt(false);
      router.replace('/?createPost=true');
    };

    return (
      <>
        <Modal
          title={i18n.t('Experience.Create.Title')}
          subtitle={i18n.t('TopNavbar.Title.Experience')}
          onClose={onClose}
          open={open}
          fullScreen={isMobile}
          maxWidth="sm">
          <ExperienceEditor
            isEdit={false}
            experience={selectedExperience}
            tags={tags}
            people={people}
            onSearchTags={handleSearchTags}
            onImageUpload={onImageUpload}
            onSearchPeople={handleSearchPeople}
            onSave={onSave}
            onSearchUser={handleSearchUser}
            users={users}
            quick
          />
        </Modal>

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
