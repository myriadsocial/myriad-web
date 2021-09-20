import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {DropdownMenu} from '../components-v2/atoms/DropdownMenu/DropdownMenu';

export default {
  title: 'UI Revamp v2.0/atoms/Dropdown Menu',
  component: DropdownMenu,
} as ComponentMeta<typeof DropdownMenu>;

const Template: ComponentStory<typeof DropdownMenu> = args => <DropdownMenu {...args} />;

export const SortExperience = Template.bind({});
SortExperience.args = {
  title: 'Sort by',
  options: [
    {id: 'first-option', title: 'All Experience'},
    {id: 'second-option', title: 'Name'},
  ],
};
