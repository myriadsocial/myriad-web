import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ProfileHeader} from '.';
import {CustomAvatarSize} from '../atoms/avatar';

export default {
  title: 'UI Revamp v2.0/components',
  component: ProfileHeader,
  argTypes: {
    size: {
      options: [CustomAvatarSize.SMALL, CustomAvatarSize.MEDIUM, CustomAvatarSize.LARGE],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof ProfileHeader>;

const Template: ComponentStory<typeof ProfileHeader> = args => <ProfileHeader {...args} />;

export const DefaultProfileHeader = Template.bind({});
DefaultProfileHeader.args = {};
