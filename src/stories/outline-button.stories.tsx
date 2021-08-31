import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {OutlinedButton} from '../components-v2/button/outlined-button.component.';

export default {
  title: 'MaterialUI/outlinedButton',
  component: OutlinedButton,
} as ComponentMeta<typeof OutlinedButton>;

const Template: ComponentStory<typeof OutlinedButton> = args => <OutlinedButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
};

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  label: 'Primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  label: 'Secondary',
};

export const CancelDelete = Template.bind({});
CancelDelete.args = {
  color: 'secondary',
  label: 'No, keep experience',
  isCancel: true,
};

export const CancelDelete2 = Template.bind({});
CancelDelete2.args = {
  color: 'secondary',
  label: 'No, let me rethink',
  isCancel: true,
};
