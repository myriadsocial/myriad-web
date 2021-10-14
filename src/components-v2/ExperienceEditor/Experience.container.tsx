import React from 'react';

import {useRouter} from 'next/router';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {Experience} from '../../interfaces/experience';
import {useStyles} from './Experience.styles';
import {ExperienceEditor} from './ExperienceEditor';

import {debounce} from 'lodash';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import {useImageUpload} from 'src/hooks/use-image-upload.hook';

export const ExperienceContainer: React.FC = () => {
  const {
    selectedExperience,
    saveExperience,
    searchTags,
    tags,
    searchPeople,
    people,
    loadExperience,
  } = useExperienceHook();
  const style = useStyles();
  const {uploadImage} = useImageUpload();
  const router = useRouter();
  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);
    if (url) return url;
    return '';
  };

  const onSave = (newExperience: Partial<Experience>, newTags: string[]) => {
    saveExperience(newExperience, newTags, (experienceId: string) => {
      router.push(`/experience/${experienceId}/preview`);
      loadExperience();
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
          description={'Create Experience'}
          sectionTitle={SectionTitle.EXPERIENCE}
        />
      </div>
      <ExperienceEditor
        experience={selectedExperience}
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
