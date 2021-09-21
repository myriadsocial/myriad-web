import React from 'react';

import MyriadIcon from '../../images/web/myriad.svg';
import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';
import {useStyles} from './Menu.styles';
import {useMenuList, MenuDetail, MenuId} from './use-menu-list';

type MenuProps = {
  selected: MenuId;
  onChange: (path: string) => void;
};

export const Menu: React.FC<MenuProps> = props => {
  const {selected, onChange} = props;

  const styles = useStyles();

  const menu = useMenuList(selected);

  const openMenu = (item: MenuDetail) => () => {
    onChange(item.url);
  };

  return (
    <div className={styles.root}>
      <BoxComponent>
        <div className={styles.head}>
          <MyriadIcon />
        </div>

        {menu.map(item => (
          <ListItemComponent
            key={item.id}
            title={item.title}
            icon={item.icon}
            active={item.active}
            onClick={openMenu(item)}
            url={item.url}
          />
        ))}
      </BoxComponent>
    </div>
  );
};
