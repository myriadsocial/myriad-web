import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Toaster, Status, toasterStatuses} from '../components-v2/atoms/Toaster';

export default {
  title: 'UI Revamp v2.0/atoms/Toaster',
  component: Toaster,
  argTypes: {
    toasterStatus: {
      options: [...toasterStatuses],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof Toaster>;

const Template: ComponentStory<typeof Toaster> = args => <Toaster {...args} />;

export const Default = Template.bind({});
Default.args = {
  open: true,
  toasterStatus: Status.SUCCESS,
  message: 'Changes saved successfully',
  onClose: console.log,
};
