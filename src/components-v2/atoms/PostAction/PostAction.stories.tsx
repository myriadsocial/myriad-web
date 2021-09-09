import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PostActionComponent} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Post Action',
  component: PostActionComponent,
} as ComponentMeta<typeof PostActionComponent>;

const Template: ComponentStory<typeof PostActionComponent> = args => (
  <PostActionComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  metrics: {
    comments: 1210,
    share: 24,
    vote: 45,
  },
  onDownVote: console.log,
  onUpvote: console.log,
};
