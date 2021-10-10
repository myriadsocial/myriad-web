import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {FriendMenuComponent} from './FriendMenu';

export default {
  title: 'UI Revamp v2.0/components/Friend',
  component: FriendMenuComponent,
} as ComponentMeta<typeof FriendMenuComponent>;

const Template: ComponentStory<typeof FriendMenuComponent> = args => (
  <FriendMenuComponent {...args} />
);

export const FriendMenu = Template.bind({});
FriendMenu.args = {};
