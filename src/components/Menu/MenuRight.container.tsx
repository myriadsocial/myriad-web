import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { MenuRight } from './MenuRight';
import { MenuRightId } from './use-menu-list';

type MenuProps = {
  logo: string;
  anonymous?: boolean;
};

export const MenuRightContainer: React.FC<MenuProps> = props => {
  const router = useRouter();

  const [selected, setSelected] = useState<MenuRightId>();

  useEffect(() => {
    parseSelected(router.pathname);
  }, [router]);

  const parseSelected = (path: string) => {
    switch (path) {
      case '/friends':
        setSelected('friends');
        break;
      case '/nft':
        setSelected('nft');
        break;
      case '/town':
        setSelected('town');
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

  return (
    <div data-testid={'menu-container-test'}>
      <MenuRight selected={selected} onChange={handleChangeMenu} {...props} />
    </div>
  );
};
