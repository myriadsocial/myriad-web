import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Snackbar} from './Snackbar';

export default {
  title: 'UI Revamp v2.0/atoms/ToasterSnack',
  component: Snackbar,
} as ComponentMeta<typeof Snackbar>;

const Template: ComponentStory<typeof Snackbar> = args => <Snackbar {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: 'Changes saved successfully',
  variant: 'success',
};
