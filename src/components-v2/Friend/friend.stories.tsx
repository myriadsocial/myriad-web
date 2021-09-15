import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {FriendComponent} from './friend';

export default {
  title: 'UI Revamp v2.0/components/Friend',
  component: FriendComponent,
} as ComponentMeta<typeof FriendComponent>;

const Template: ComponentStory<typeof FriendComponent> = args => <FriendComponent {...args} />;

export const Friend = Template.bind({});
Friend.args = {};
