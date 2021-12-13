import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ToasterSnack} from '../components-v2/atoms/ToasterSnack';

export default {
  title: 'UI Revamp v2.0/atoms/ToasterSnack',
  component: ToasterSnack,
} as ComponentMeta<typeof ToasterSnack>;

const Template: ComponentStory<typeof ToasterSnack> = args => <ToasterSnack {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: 'Changes saved successfully',
  variant: 'success',
};
