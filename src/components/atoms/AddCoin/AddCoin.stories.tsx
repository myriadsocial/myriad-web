import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {AddCoin} from './AddCoin.component';

export default {
  title: 'UI Revamp v2.0/atoms/AddCoin',
  component: AddCoin,
} as ComponentMeta<typeof AddCoin>;

const Template: ComponentStory<typeof AddCoin> = args => <AddCoin {...args} />;

export const addCoin = Template.bind({});
addCoin.args = {
  onClose: console.log,
  open: true,
};
