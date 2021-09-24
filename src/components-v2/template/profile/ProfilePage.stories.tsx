import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ProfilePage} from './ProfilePage';

export default {
  title: 'UI Revamp v2.0/templates/Profile Page',
  component: ProfilePage,
} as ComponentMeta<typeof ProfilePage>;

const Template: ComponentStory<typeof ProfilePage> = () => <ProfilePage />;

export const WebDefault = Template.bind({});
WebDefault.args = {};
