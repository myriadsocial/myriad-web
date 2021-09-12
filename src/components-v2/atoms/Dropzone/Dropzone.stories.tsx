import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Dropzone} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Dropzone',
  component: Dropzone,
  argTypes: {},
} as ComponentMeta<typeof Dropzone>;

const Template: ComponentStory<typeof Dropzone> = args => <Dropzone {...args} />;

export const ImageUpload = Template.bind({});
ImageUpload.args = {
  onImageSelected: console.log,
};
