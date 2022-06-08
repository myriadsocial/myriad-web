import React from 'react';

import {useRouter} from 'next/router';

import {BoxComponent} from '../atoms/Box';
import {MyriadFullBlackIcon} from '../atoms/Icons';
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
  const router = useRouter();

  const menu = useMenuList(selected);

  const gotoHome = () => {
    router.push('/home', undefined, {shallow: true});
  };

  const openMenu = (item: MenuDetail) => () => {
    onChange(item.url);
  };

  return (
    <div className={styles.root}>
      <BoxComponent paddingLeft={0} paddingRight={0}>
        <div className={styles.head} onClick={gotoHome} aria-hidden="true">
          <MyriadFullBlackIcon />
        </div>

        {menu
          .filter(ar => ar.isDesktop === true)
          .map(item => (
            <ListItemComponent
              id={item.id}
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
