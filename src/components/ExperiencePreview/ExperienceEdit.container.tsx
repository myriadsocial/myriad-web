import React, {useEffect} from 'react';

import {useRouter} from 'next/router';

import {ExperienceEditor} from '../ExperienceEditor/ExperienceEditor';
import {useStyles} from './experience.style';

import {debounce} from 'lodash';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useUpload} from 'src/hooks/use-upload.hook';
import {Experience} from 'src/interfaces/experience';

export const ExperienceEditContainer: React.FC = () => {
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
  const {experienceId} = router.query;
  const style = useStyles();

  useEffect(() => {
    if (experienceId) getExperienceDetail(experienceId);
  }, []);

  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);
    if (url) return url;
    return '';
  };

  const onSave = (newExperience: Partial<Experience>, newTags: string[]) => {
    updateExperience(newExperience, newTags, (experienceId: string) => {
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
      <div className={style.mb}>
        <TopNavbarComponent
          description={'Edit Experience'}
          sectionTitle={SectionTitle.EXPERIENCE}
        />
      </div>
      <ExperienceEditor
        type={'Edit'}
        experience={experience}
        tags={tags}
        people={people}
        onSearchTags={handleSearchTags}
        onImageUpload={onImageUpload}
        onSearchPeople={handleSearchPeople}
        onSave={onSave}
      />
    </>
  );
};
