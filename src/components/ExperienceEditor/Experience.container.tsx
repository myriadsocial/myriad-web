import React from 'react';

import {useRouter} from 'next/router';

import {useStyles} from './Experience.styles';
import {ExperienceEditor} from './ExperienceEditor';

import debounce from 'lodash/debounce';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useSearchHook} from 'src/hooks/use-search.hooks';
import {useUpload} from 'src/hooks/use-upload.hook';
import {ExperienceProps} from 'src/interfaces/experience';
import i18n from 'src/locale';

export const ExperienceContainer: React.FC = () => {
  // TODO: separate hook for tag, people and experience
  const {
    selectedExperience,
    tags,
    people,
    saveExperience,
    searchTags,
    searchPeople,
    loadExperience,
  } = useExperienceHook();
  const {searchUsers, users} = useSearchHook();
  const style = useStyles();

  const {uploadImage} = useUpload();
  const router = useRouter();

  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);

    return url ?? '';
  };

  const onSave = (attributes: ExperienceProps) => {
    saveExperience(attributes, (experienceId: string) => {
      router.push(`/experience/${experienceId}`);

      loadExperience();
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

  return (
    <>
      <div className={style.mb}>
        <TopNavbarComponent
          description={i18n.t('TopNavbar.Subtitle.Experience_Create')}
          sectionTitle={i18n.t('TopNavbar.Title.Experience')}
        />
      </div>
      <div className={style.box}>
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
        />
      </div>
    </>
  );
};
