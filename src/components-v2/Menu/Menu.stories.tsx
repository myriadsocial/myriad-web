import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Menu} from '.';

export default {
  title: 'UI Revamp v2.0/components',
  component: Menu,
  argTypes: {},
} as ComponentMeta<typeof Menu>;

const Template: ComponentStory<typeof Menu> = args => <Menu {...args} />;

export const SidebarMenu = Template.bind({});
SidebarMenu.args = {};
