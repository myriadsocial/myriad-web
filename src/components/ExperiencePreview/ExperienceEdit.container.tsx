import React, {useEffect} from 'react';

import {useRouter} from 'next/router';

import {ExperienceEditor} from '../ExperienceEditor/ExperienceEditor';

import {debounce} from 'lodash';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useUpload} from 'src/hooks/use-upload.hook';
import {ExperienceProps} from 'src/interfaces/experience';

export const ExperienceEditContainer: React.FC = () => {
  // TODO: separate hook for tag, people and experience
  const {
    experience,
    people,
    tags,
    searchTags,
    searchPeople,
    getExperienceDetail,
    updateExperience,
  } = useExperienceHook();
  const {uploadImage} = useUpload();
  const router = useRouter();

  useEffect(() => {
    const {experienceId} = router.query;

    if (experienceId) getExperienceDetail(experienceId);
  }, [router.query]);

  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);

    return url ?? '';
  };

  const onSave = (attributes: ExperienceProps) => {
    if (!experience) return;

    updateExperience(experience.id, attributes, () => {
      router.push(`/experience/${experience.id}/preview`);
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
        description={'Edit Experience'}
        sectionTitle={SectionTitle.EXPERIENCE}
        reverse
      />

      {experience && (
        <ExperienceEditor
          type={'edit'}
          experience={experience}
          tags={tags}
          people={people}
          onSearchTags={handleSearchTags}
          onImageUpload={onImageUpload}
          onSearchPeople={handleSearchPeople}
          onSave={onSave}
        />
      )}
    </>
  );
};
