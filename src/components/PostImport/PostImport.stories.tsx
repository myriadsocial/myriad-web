import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PostImport as PostImportComponent} from './PostImport';

export default {
  title: 'UI Revamp v2.0/components/Post Import',
  component: PostImportComponent,
} as ComponentMeta<typeof PostImportComponent>;

const Template: ComponentStory<typeof PostImportComponent> = args => (
  <PostImportComponent {...args} />
);

export const PostImport = Template.bind({});
PostImport.args = {
  value: 'https://www.youtube.com/watch?v=zPKxNTt-8A4',
};
