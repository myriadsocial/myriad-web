import React, {useEffect} from 'react';

import {useRouter} from 'next/router';

import {ExperienceEditor} from '../ExperienceEditor/ExperienceEditor';

import {debounce} from 'lodash';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useUpload} from 'src/hooks/use-upload.hook';
import {ExperienceProps} from 'src/interfaces/experience';
import i18n from 'src/locale';

export const ExperienceCloneContainer: React.FC = () => {
  // TODO: separate hook for tag, people and experience
  const {searchTags, tags, searchPeople, people, experience, getExperienceDetail, cloneExperience} =
    useExperienceHook();
  const {uploadImage} = useUpload();
  const router = useRouter();
  const {experienceId} = router.query;

  useEffect(() => {
    if (experienceId) getExperienceDetail(experienceId);
  }, [router.query]);

  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);

    return url ?? '';
  };

  const handleCloneExperience = (attributes: ExperienceProps) => {
    if (!experience) return;

    cloneExperience(experience.id, attributes, (experienceId: string) => {
      router.push(`/experience/${experienceId}/preview`);
    });
  };

  const handleSearchTags = debounce((query: string) => {
    searchTags(query);
  }, 300);

  const handleSearchPeople = debounce((query: string) => {
    searchPeople(query);
  }, 300);

  return (
    <>
      <TopNavbarComponent
        description={i18n.t('TopNavbar.Subtitle.Experience_Clone')}
        sectionTitle={i18n.t('TopNavbar.Title.Experience')}
        reverse
      />

      {experience && (
        <ExperienceEditor
          type={i18n.t('Experience.Clone.Type')}
          experience={experience}
          tags={tags}
          people={people}
          onSearchTags={handleSearchTags}
          onImageUpload={onImageUpload}
          onSearchPeople={handleSearchPeople}
          onSave={handleCloneExperience}
        />
      )}
    </>
  );
};
