export enum SectionTitle {
  FRIENDS = 'Friends',
  SOCIAL_MEDIA = 'Social Media',
  WALLET = 'Wallet',
  EXPERIENCE = 'Experience',
  PROFILE = 'Profile',
  SETTINGS = 'Settings',
  NOTIFICATION = 'Notification',
  TIMELINE = 'Timeline',
  NFT = 'NFT',
  SOCIAL_TOKEN = 'Social Token',
  TRENDS = 'Trends',
}

export type TopNavbarProps = {
  sectionTitle: SectionTitle | string;
  description: string;
  type?: 'menu' | 'back';
  reverse?: boolean;
};
