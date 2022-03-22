import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ExperienceEditor} from '.';
import {CurrencyId} from '../../interfaces/currency';
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
    createdAt: new Date(),
    updatedAt: new Date('2021-09-03T06:46:39.000Z'),
    createdBy: '232',
    id: '123',
    people: [],
    tags: ['developer'],
    allowedTags: ['crypto', 'near'],
    user: {
      defaultCurrency: CurrencyId.AUSD,
      id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
      name: 'Nomaden',
      profilePictureURL:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
      bannerImageUrl: undefined,
      bio: 'Nomaden? No Home',
      fcmTokens: [
        'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
      ],
      createdAt: new Date('2021-07-15T03:40:23.000Z'),
      updatedAt: new Date('2021-09-03T06:46:39.000Z'),
      currencies: [],
      wallets: [],
    },
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
