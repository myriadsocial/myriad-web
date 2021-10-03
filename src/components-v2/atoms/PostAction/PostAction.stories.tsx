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
    shares: 24,
    upvotes: 0,
    downvotes: 0,
    discussions: 0,
    debates: 0,
    likes: 0,
    dislikes: 0,
  },
  onDownVote: console.log,
  onUpvote: console.log,
};
