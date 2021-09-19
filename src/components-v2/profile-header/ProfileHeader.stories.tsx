import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ProfileHeader as ProfileHeaderComponent} from '.';
import {CustomAvatarSize} from '../atoms/avatar';

export default {
  title: 'UI Revamp v2.0/components/Profile Header',
  component: ProfileHeaderComponent,
  argTypes: {
    size: {
      options: [CustomAvatarSize.SMALL, CustomAvatarSize.MEDIUM, CustomAvatarSize.LARGE],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof ProfileHeaderComponent>;

const Template: ComponentStory<typeof ProfileHeaderComponent> = args => (
  <ProfileHeaderComponent {...args} />
);

export const ProfileHeader = Template.bind({});
ProfileHeader.args = {};
