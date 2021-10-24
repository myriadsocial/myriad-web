import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PostCreate as PostCreateComponent} from './PostCreate';

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
      id: '60efac8c565ab8004ed28ba6',
      name: 'Elon Musk',
      avatar: 'https://pbs.twimg.com/profile_images/1383184766959120385/MM9DHPWC_400x400.jpg',
      username: 'elonmusk',
    },
  ],
};
