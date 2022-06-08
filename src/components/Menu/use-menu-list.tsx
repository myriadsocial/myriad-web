import {
  HomeIcon,
  CurrencyDollarIcon,
  CogIcon,
  UsersIcon,
  PhotographIcon,
  HashtagIcon,
  VariableIcon,
  TrendingUpIcon,
  ViewGridIcon,
  CreditCardIcon,
} from '@heroicons/react/outline';

import React, {useMemo} from 'react';

import i18n from 'src/locale';

export type MenuId =
  | 'home'
  | 'friends'
  | 'token'
  | 'nft'
  | 'settings'
  | 'experience-trend'
  | 'experience'
  | 'wallet'
  | 'trends'
  | 'socials';

export type MenuDetail = {
  id: MenuId;
  title: string;
  active: boolean;
  icon: React.ReactNode;
  url: string;
  isDesktop: boolean;
};

export const useMenuList = (selected: MenuId): MenuDetail[] => {
  const menu: MenuDetail[] = useMemo(
    () => [
      {
        id: 'home',
        title: i18n.t('Section.Home'),
        active: selected === 'home',
        icon: HomeIcon,
        url: '/home',
        isDesktop: true,
      },
      {
        id: 'friends',
        title: i18n.t('Section.Friends'),
        active: selected === 'friends',
        icon: UsersIcon,
        url: '/friends',
        isDesktop: true,
      },
      {
        id: 'token',
        title: i18n.t('Section.Social_Token'),
        active: selected === 'token',
        icon: CurrencyDollarIcon,
        url: '/socialtoken',
        isDesktop: true,
      },
      {
        id: 'nft',
        title: i18n.t('Section.NFT'),
        active: selected === 'nft',
        icon: PhotographIcon,
        url: '/nft',
        isDesktop: true,
      },
      {
        id: 'socials',
        title: i18n.t('Section.Social_Media'),
        active: selected === 'socials',
        icon: ViewGridIcon,
        url: '/socials',
        isDesktop: true,
      },
      {
        id: 'wallet',
        title: i18n.t('Section.Wallet'),
        active: selected === 'wallet',
        icon: CreditCardIcon,
        url: '/wallet',
        isDesktop: true,
      },
      {
        id: 'experience-trend',
        title: i18n.t('Section.Trending_Experience'),
        active: selected === 'experience-trend',
        icon: TrendingUpIcon,
        url: '/experience/trending',
        isDesktop: false,
      },
      {
        id: 'experience',
        title: i18n.t('Section.Experience'),
        active: selected === 'experience',
        icon: VariableIcon,
        url: '/experience',
        isDesktop: false,
      },
      {
        id: 'trends',
        title: i18n.t('Section.Trends'),
        active: selected === 'trends',
        icon: HashtagIcon,
        url: '/topic',
        isDesktop: false,
      },
      {
        id: 'settings',
        title: i18n.t('Section.Settings'),
        active: selected === 'settings',
        icon: CogIcon,
        url: '/settings',
        isDesktop: true,
      },
    ],
    [selected],
  );

  return menu;
};
