import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ExperienceEditor} from '.';
import {SocialsEnum} from '../../interfaces/social';

export default {
  title: 'UI Revamp v2.0/components/Experience Editor',
  component: ExperienceEditor,
  argTypes: {},
} as ComponentMeta<typeof ExperienceEditor>;

const Template: ComponentStory<typeof ExperienceEditor> = args => <ExperienceEditor {...args} />;

export const CreateExperience = Template.bind({});
CreateExperience.args = {
  onSave: console.log,
  onImageUpload: async (files: File[]) => {
    return 'https://res.cloudinary.com/dsget80gs/lu2f67ljt0oqnaacuu7y.jpg';
  },
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

export const EditExperience = Template.bind({});
EditExperience.args = {
  onSave: console.log,
  onImageUpload: async (files: File[]) => {
    return 'https://res.cloudinary.com/dsget80gs/lu2f67ljt0oqnaacuu7y.jpg';
  },
  experience: {
    name: 'Example experience',
    description: 'Sample',
    people: [],
    allowedTags: ['crypto', 'near'],
  },
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
