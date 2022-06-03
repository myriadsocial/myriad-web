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
  | 'topic'
  | 'socials';

export type MenuDetail = {
  id: MenuId;
  title: string;
  active: boolean;
  icon: React.ReactNode;
  url: string;
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
      },
      {
        id: 'friends',
        title: i18n.t('Section.Friends'),
        active: selected === 'friends',
        icon: UsersIcon,
        url: '/friends',
      },
      {
        id: 'token',
        title: i18n.t('Section.Social_Token'),
        active: selected === 'token',
        icon: CurrencyDollarIcon,
        url: '/socialtoken',
      },
      {
        id: 'nft',
        title: i18n.t('Section.NFT'),
        active: selected === 'nft',
        icon: PhotographIcon,
        url: '/nft',
      },
      {
        id: 'socials',
        title: i18n.t('Section.Social_Media'),
        active: selected === 'socials',
        icon: ViewGridIcon,
        url: '/socials',
      },
      {
        id: 'wallet',
        title: i18n.t('Section.Wallet'),
        active: selected === 'wallet',
        icon: CreditCardIcon,
        url: '/wallet',
      },
      {
        id: 'experience-trend',
        title: i18n.t('Section.Trending_Experience'),
        active: selected === 'experience-trend',
        icon: TrendingUpIcon,
        url: '/experience',
      },
      {
        id: 'experience',
        title: i18n.t('Section.Experience'),
        active: selected === 'experience',
        icon: VariableIcon,
        url: '/experience',
      },
      {
        id: 'topic',
        title: i18n.t('Section.Topic'),
        active: selected === 'topic',
        icon: HashtagIcon,
        url: '/topic',
      },
      {
        id: 'settings',
        title: i18n.t('Section.Settings'),
        active: selected === 'settings',
        icon: CogIcon,
        url: '/settings',
      },
    ],
    [selected],
  );

  return menu;
};
