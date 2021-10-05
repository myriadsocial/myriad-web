import React from 'react';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {Experience} from '../../interfaces/experience';
import {ExperienceEditor} from './ExperienceEditor';

import {debounce} from 'lodash';
import {useImageUpload} from 'src/hooks/use-image-upload.hook';

export const ExperienceContainer: React.FC = () => {
  const {selectedExperience, saveExperience, searchTags, tags, searchPeople, people} =
    useExperienceHook();
  const {uploadImage} = useImageUpload();

  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);
    if (url) return url;
    return '';
  };

  const onSave = (newExperience: Partial<Experience>, newTags: string[]) => {
    saveExperience(newExperience, newTags);
  };

  const handleSearchTags = debounce((query: string) => {
    searchTags(query);
  }, 300);

  const handleSearchPeople = debounce((query: string) => {
    searchPeople(query);
  }, 300);

  return (
    <ExperienceEditor
      experience={selectedExperience}
      tags={tags}
      people={people}
      onSearchTags={handleSearchTags}
      onImageUpload={onImageUpload}
      onSearchPeople={handleSearchPeople}
      onSave={onSave}
    />
  );
};
