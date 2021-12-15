import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {FriendTabPanelComponent} from './FriendTabPanel';

export default {
  title: 'UI Revamp v2.0/components/FriendTab',
  component: FriendTabPanelComponent,
} as ComponentMeta<typeof FriendTabPanelComponent>;

const Template: ComponentStory<typeof FriendTabPanelComponent> = args => (
  <FriendTabPanelComponent {...args} />
);

export const FriendTab = Template.bind({});
FriendTab.args = {};
