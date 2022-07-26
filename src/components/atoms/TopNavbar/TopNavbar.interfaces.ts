import React from 'react';

export enum SectionTitle {
  FRIENDS = 'Friends',
  SOCIAL_MEDIA = 'Social Media',
  WALLET = 'Wallet',
  TRENDING_EXPERIENCE = 'Top 10 Experiences',
  EXPERIENCE = 'Experience',
  PROFILE = 'Profile',
  SETTINGS = 'Settings',
  NOTIFICATION = 'Notification',
  TIMELINE = 'Timeline',
  NFT = 'NFT',
  MYRIAD_TOWN = 'Myriad.Town',
  SOCIAL_TOKEN = 'Social Token',
  TRENDS = 'Trends',
}

export type TopNavbarProps = {
  sectionTitle: SectionTitle | string;
  description: string | React.ReactNode;
  type?: 'menu' | 'back';
  reverse?: boolean;
  onClick?: () => void;
};
