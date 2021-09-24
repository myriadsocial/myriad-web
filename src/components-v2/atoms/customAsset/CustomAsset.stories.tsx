import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CustomAsset} from './CustomAsset.component';

export default {
  title: 'UI Revamp v2.0/atoms/customAsset',
  component: CustomAsset,
} as ComponentMeta<typeof CustomAsset>;

const Template: ComponentStory<typeof CustomAsset> = args => <CustomAsset {...args} />;

export const customAsset = Template.bind({});
customAsset.args = {
  onClose: console.log,
  open: true,
};
