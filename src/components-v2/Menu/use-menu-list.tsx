import {HomeIcon, CurrencyDollarIcon, CogIcon, UsersIcon, StopIcon} from '@heroicons/react/outline';

import React, {useMemo} from 'react';

export type MenuId = 'home' | 'friends' | 'token' | 'nft' | 'settings';

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
        url: '/',
      },
      {
        id: 'friends',
        title: 'Friends',
        active: selected === 'friends',
        icon: UsersIcon,
        url: '/',
      },
      {
        id: 'token',
        title: 'Social Token',
        active: selected === 'token',
        icon: CurrencyDollarIcon,
        url: '/',
      },
      {
        id: 'nft',
        title: 'NFT',
        active: selected === 'nft',
        icon: StopIcon,
        url: '/',
      },
      {
        id: 'settings',
        title: 'Settings',
        active: selected === 'settings',
        icon: CogIcon,
        url: '/',
      },
    ],
    [],
  );

  return menu;
};
