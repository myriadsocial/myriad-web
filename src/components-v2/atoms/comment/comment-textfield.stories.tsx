import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CommentTextFieldComponent} from './comment-textfield.component';

export default {
  title: 'UI Revamp v2.0/atoms/comment/textfield',
  component: CommentTextFieldComponent,
} as ComponentMeta<typeof CommentTextFieldComponent>;

const Template: ComponentStory<typeof CommentTextFieldComponent> = args => (
  <CommentTextFieldComponent {...args} />
);

export const CommentTextField = Template.bind({});
CommentTextField.args = {
  onSubmit: console.log,
  username: 'Test',
  avatar: 'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
};
