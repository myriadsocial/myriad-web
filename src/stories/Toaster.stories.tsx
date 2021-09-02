import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Toaster, Status, toasterStatuses} from '../../src/components-v2/atoms/toaster';

export default {
  title: 'UI Revamp v2.0/atoms/Toaster',
  component: Toaster,
  argTypes: {
    status: {
      options: [...toasterStatuses],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof Toaster>;

const Template: ComponentStory<typeof Toaster> = args => <Toaster {...args} />;

export const Default = Template.bind({});
Default.args = {
  status: Status.SUCCESS,
  message: 'Changes saved successfully',
};
