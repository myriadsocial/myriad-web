import React from 'react';

import {useRouter} from 'next/router';

import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';
import {useStyles} from './Menu.styles';
import {useMenuList, MenuDetail, MenuId} from './use-menu-list';

type MenuProps = {
  selected: MenuId;
  onChange: (path: string) => void;
  logo: string;
};

export const Menu: React.FC<MenuProps> = props => {
  const {selected, onChange, logo} = props;

  const styles = useStyles();
  const router = useRouter();

  const menu = useMenuList(selected);

  const gotoHome = () => {
    if (router.pathname === '/home') return;
    router.push('/home', undefined, {shallow: true});
  };

  const openMenu = (item: MenuDetail) => () => {
    if (selected === item.url.split('/')[1]) return;
    onChange(item.url);
  };

  return (
    <div className={styles.root}>
      <BoxComponent paddingLeft={0} paddingRight={0}>
        <div className={styles.head} onClick={gotoHome} aria-hidden="true">
          <img src={logo} width={220} height={48} />
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
              isAnimated={item.isAnimated}
            />
          ))}
      </BoxComponent>
    </div>
  );
};
