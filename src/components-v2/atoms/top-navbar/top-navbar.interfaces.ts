enum SectionTitle {
  FRIENDS = 'Friends',
  SOCIAL_MEDIA = 'Social Media',
  WALLET = 'Wallet',
  EXPERIENCE = 'Experience',
  PROFILE = 'Profile',
}

type SectionTitleKey = keyof typeof SectionTitle;
type SectionTitleValue = typeof SectionTitle[SectionTitleKey];
const sectionTitles: SectionTitleValue[] = Object.values(SectionTitle);

interface TopNavbarProps {
  sectionTitle: SectionTitle;
  description: string;
}

export {SectionTitle, sectionTitles};
export type {TopNavbarProps};
