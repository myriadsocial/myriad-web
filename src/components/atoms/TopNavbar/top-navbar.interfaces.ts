enum SectionTitle {
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
}

type SectionTitleKey = keyof typeof SectionTitle;
type SectionTitleValue = typeof SectionTitle[SectionTitleKey];
const sectionTitles: SectionTitleValue[] = Object.values(SectionTitle);

interface TopNavbarProps {
  sectionTitle: SectionTitle | string;
  description: string;
}

export {SectionTitle, sectionTitles};
export type {TopNavbarProps};
