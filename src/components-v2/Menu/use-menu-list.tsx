import React, {useMemo} from 'react';

import DollarIcon from '../../images/web/dollar.svg';
import HomeIcon from '../../images/web/home.svg';
import NftIcon from '../../images/web/nft.svg';
import SettingsIcon from '../../images/web/settings.svg';
import UserIcon from '../../images/web/users.svg';

export type MenuDetail = {
  id: string;
  title: string;
  active: boolean;
  icon: React.ReactNode;
  url: string;
};

export const useMenuList = (): MenuDetail[] => {
  const menu: MenuDetail[] = useMemo(
    () => [
      {
        id: 'home',
        title: 'Home',
        active: true,
        icon: HomeIcon,
        url: '/',
      },
      {
        id: 'friends',
        title: 'Friends',
        active: false,
        icon: UserIcon,
        url: '/',
      },
      {
        id: 'token',
        title: 'Social Token',
        active: false,
        icon: DollarIcon,
        url: '/',
      },
      {
        id: 'nft',
        title: 'NFT',
        active: false,
        icon: NftIcon,
        url: '/',
      },
      {
        id: 'settings',
        title: 'Settings',
        active: false,
        icon: SettingsIcon,
        url: '/',
      },
    ],
    [],
  );

  return menu;
};
