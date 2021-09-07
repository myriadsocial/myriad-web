import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ProfileHeader} from '../../src/components-v2/profile-header/';

export default {
  title: 'UI Revamp v2.0/components',
  component: ProfileHeader,
} as ComponentMeta<typeof ProfileHeader>;

const Template: ComponentStory<typeof ProfileHeader> = args => <ProfileHeader {...args} />;

export const DefaultProfileHeader = Template.bind({});
DefaultProfileHeader.args = {};
