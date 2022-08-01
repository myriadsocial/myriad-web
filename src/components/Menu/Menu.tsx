import React from 'react';

import Image from 'next/image';
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
    router.push('/home', undefined, {shallow: true});
  };

  const openMenu = (item: MenuDetail) => () => {
    onChange(item.url);
  };

  return (
    <div className={styles.root}>
      <BoxComponent paddingLeft={0} paddingRight={0}>
        <div className={styles.head} onClick={gotoHome} aria-hidden="true">
          <Image src={logo} width={220} height={36} quality={100} />
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
