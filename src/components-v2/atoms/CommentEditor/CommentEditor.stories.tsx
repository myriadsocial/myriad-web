import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CommentEditor as CommentEditorComponent} from './CommentEditor';

export default {
  title: 'UI Revamp v2.0/atoms/Comment Editor',
  component: CommentEditorComponent,
} as ComponentMeta<typeof CommentEditorComponent>;

const Template: ComponentStory<typeof CommentEditorComponent> = args => (
  <CommentEditorComponent {...args} />
);

export const CommentEditor = Template.bind({});
CommentEditor.args = {
  onSubmit: console.log,
  username: 'Test',
  avatar: 'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
};
