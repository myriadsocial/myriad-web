import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CommentTextFieldComponent} from './comment-textfield.component';

export default {
  title: 'UI Revamp v2.0/atoms/comment',
  component: CommentTextFieldComponent,
} as ComponentMeta<typeof CommentTextFieldComponent>;

const Template: ComponentStory<typeof CommentTextFieldComponent> = args => (
  <CommentTextFieldComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onSubmit: console.log,
};
