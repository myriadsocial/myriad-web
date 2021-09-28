import React from 'react';

import {Menu} from './Menu';
import {SidebarMenu} from './Menu.stories';

export const MenuContainer: React.FC = () => {
  return <Menu selected={'home'} onChange={SidebarMenu.args?.onChange ?? console.log} />;
};
