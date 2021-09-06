import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PostCreate as PostCreateComponent} from './PostCreate';

export default {
  title: 'UI Revamp v2.0/components/Post Create',
  component: PostCreateComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof PostCreateComponent>;

const Template: ComponentStory<typeof PostCreateComponent> = args => (
  <PostCreateComponent {...args} />
);

export const PostCreate = Template.bind({});
PostCreate.args = {
  value: 'text',
};
