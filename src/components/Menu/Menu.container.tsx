import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Menu } from './Menu';
import { MenuId } from './use-menu-list';

type MenuProps = {
  logo: string;
  anonymous?: boolean;
};

export const MenuContainer: React.FC<MenuProps> = props => {
  const router = useRouter();

  const [selected, setSelected] = useState<MenuId>();

  useEffect(() => {
    parseSelected(router.pathname);
  }, [router]);

  const parseSelected = (path: string) => {
    switch (path) {
      case '/':
        setSelected('timeline');
        break;
      case '/all':
        setSelected('all');
        break;
      default:
        break;
    }
  };

  const handleChangeMenu = (path: MenuId) => {
    parseSelected(path);
  };

  return (
    <div data-testid={'menu-container-test'}>
      <Menu selected={selected} onChange={handleChangeMenu} {...props} />
    </div>
  );
};
