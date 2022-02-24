import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PostCreate as PostCreateComponent} from './PostCreate';

import {CurrencyId} from 'src/interfaces/currency';

export default {
  title: 'UI Revamp v2.0/components/Post Create',
  component: PostCreateComponent,
  argTypes: {},
} as ComponentMeta<typeof PostCreateComponent>;

const Template: ComponentStory<typeof PostCreateComponent> = args => (
  <PostCreateComponent {...args} />
);

export const PostCreate = Template.bind({});
PostCreate.args = {
  open: true,
  onClose: console.log,
  onSubmit: console.log,
  people: [
    {
      defaultCurrency: CurrencyId.AUSD,
      id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
      name: 'Test user',
      profilePictureURL:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
      bio: 'Test User',
      fcmTokens: [],
      createdAt: new Date('2021-07-15T03:40:23.000Z'),
      updatedAt: new Date('2021-09-03T06:46:39.000Z'),
      currencies: [],
    },
  ],
};
