import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {TopNavbarComponent, SectionTitle} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Top Navbar',
  component: TopNavbarComponent,
} as ComponentMeta<typeof TopNavbarComponent>;

const Template: ComponentStory<typeof TopNavbarComponent> = args => (
  <TopNavbarComponent {...args} />
);

export const FriendsTopNavbar = Template.bind({});
FriendsTopNavbar.args = {
  sectionTitle: SectionTitle.FRIENDS,
  description: '102 friends',
};

export const SocialMediaTopNavbar = Template.bind({});
SocialMediaTopNavbar.args = {
  sectionTitle: SectionTitle.SOCIAL_MEDIA,
  description: '3 accounts connected',
};

export const WalletTopNavbar = Template.bind({});
WalletTopNavbar.args = {
  sectionTitle: SectionTitle.WALLET,
  description: '2 Crypto assets',
};

export const ExperienceTopNavbar = Template.bind({});
ExperienceTopNavbar.args = {
  sectionTitle: SectionTitle.EXPERIENCE,
  description: 'Bitcoin Strategy',
};

export const ProfileTopNavbar = Template.bind({});
ProfileTopNavbar.args = {
  sectionTitle: SectionTitle.PROFILE,
  description: 'Louis Liu',
};
