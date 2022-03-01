import {
  HomeIcon,
  CurrencyDollarIcon,
  CogIcon,
  UsersIcon,
  PhotographIcon,
  HashtagIcon,
  VariableIcon,
  ViewGridIcon,
  CreditCardIcon,
} from '@heroicons/react/outline';

import React, {useMemo} from 'react';

export type MenuId =
  | 'home'
  | 'friends'
  | 'token'
  | 'nft'
  | 'settings'
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
        title: 'Home',
        active: selected === 'home',
        icon: HomeIcon,
        url: '/home',
      },
      {
        id: 'experience',
        title: 'Experience',
        active: selected === 'experience',
        icon: VariableIcon,
        url: '/experience',
      },
      {
        id: 'wallet',
        title: 'Wallet',
        active: selected === 'wallet',
        icon: CreditCardIcon,
        url: '/wallet',
      },
      {
        id: 'friends',
        title: 'Friends',
        active: selected === 'friends',
        icon: UsersIcon,
        url: '/friends',
      },
      {
        id: 'token',
        title: 'Social Token',
        active: selected === 'token',
        icon: CurrencyDollarIcon,
        url: '/socialtoken',
      },
      {
        id: 'nft',
        title: 'NFT',
        active: selected === 'nft',
        icon: PhotographIcon,
        url: '/nft',
      },
      {
        id: 'topic',
        title: 'Topic',
        active: selected === 'topic',
        icon: HashtagIcon,
        url: '/topic',
      },
      {
        id: 'socials',
        title: 'Social Media',
        active: selected === 'socials',
        icon: ViewGridIcon,
        url: '/socials',
      },
      {
        id: 'settings',
        title: 'Settings',
        active: selected === 'settings',
        icon: CogIcon,
        url: '/settings',
      },
    ],
    [selected],
  );

  return menu;
};
