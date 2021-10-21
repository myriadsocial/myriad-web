import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/router';

import {Menu} from './Menu';
import {MenuId} from './use-menu-list';

export const MenuContainer: React.FC = () => {
  const router = useRouter();

  const [selected, setSelected] = useState<MenuId>('home');

  useEffect(() => {
    parseSelected(router.pathname);
  }, [router]);

  const parseSelected = (path: string) => {
    switch (path) {
      case '/friends':
        setSelected('friends');
        break;
      case '/socials':
        setSelected('token');
        break;
      case '/nft':
        setSelected('nft');
        break;
      case '/settings':
        setSelected('settings');
        break;
      default:
        break;
    }
  };

  const handleChangeMenu = (path: string) => {
    router.push(path);
  };

  return <Menu selected={selected} onChange={handleChangeMenu} />;
};
