import React from 'react';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {Experience} from '../../interfaces/experience';
<<<<<<< HEAD
import {ExperienceEditor} from './ExperienceEditor';

import {debounce} from 'lodash';
import {useImageUpload} from 'src/hooks/use-image-upload.hook';

export const ExperienceContainer: React.FC = () => {
  const {selectedExperience, saveExperience, searchTags, tags, searchPeople, people} =
    useExperienceHook();
=======
import {SocialsEnum} from '../../interfaces/social';
import {ExperienceEditor} from './ExperienceEditor';

import {useImageUpload} from 'src/hooks/use-image-upload.hook';

const experience = {
  tags: [
    {
      id: 'crypto',
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'nsfw',
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  people: [
    {
      id: '1',
      name: 'Person 1',
      originUserId: '1',
      platform: SocialsEnum.FACEBOOK,
      profilePictureURL: 'https://res.cloudinary.com/dsget80gs/bd75blw2pnmpj9aqwdxm.png',
      username: 'personone',
    },
    {
      id: '2',
      name: 'Person 2',
      originUserId: '2',
      platform: SocialsEnum.FACEBOOK,
      profilePictureURL: 'https://res.cloudinary.com/dsget80gs/rvi6x1stnczatom2jq2y.jpg',
      username: 'persontwo',
    },
  ],
};
export const ExperienceContainer: React.FC = () => {
  const {selectedExperience, saveExperience} = useExperienceHook();
>>>>>>> 9c84ee61 (MYR-872: wiring create experience)
  const {uploadImage} = useImageUpload();

  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);
    if (url) return url;
    return '';
  };

  const onSave = (newExperience: Partial<Experience>, newTags: string[]) => {
    saveExperience(newExperience, newTags);
  };

<<<<<<< HEAD
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
=======
  return (
    <ExperienceEditor
      experience={selectedExperience}
      tags={experience.tags}
      people={experience.people}
      onSearchTags={console.log}
      onImageUpload={onImageUpload}
      onSearchPeople={console.log}
>>>>>>> 9c84ee61 (MYR-872: wiring create experience)
      onSave={onSave}
    />
  );
};
