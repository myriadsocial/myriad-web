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
  url: 'https://www.facebook.com/electronicosfantasticos/videos/1179074382533015',
  value:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tristique eget quam a auctor. Etiam eu tincidunt massa. Nam tincidunt dignissim varius. Cras suscipit suscipit dolor in hendrerit. In quis aliquam dolor, eget porta purus.',
};
