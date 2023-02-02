import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/router';

import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';
import {useStyles} from './Menu.styles';
import {useMenuList, MenuDetail, MenuId} from './use-menu-list';

import SelectServer from 'components/SelectServer';
import Cookies from 'js-cookie';
import {ServerListProps} from 'src/interfaces/server-list';
import i18n from 'src/locale';

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

  const [serverSelected, setServerSelected] = useState<null | ServerListProps>(null);

  const gotoHome = () => {
    if (router.pathname === '/') return;
    router.push('/', undefined, {shallow: true});
  };

  const openMenu = (item: MenuDetail) => () => {
    if (router.pathname === item.url) return;
    onChange(item.url);
  };

  const toggleSelected = (server: ServerListProps) => {
    setServerSelected(server);
  };

  useEffect(() => {
    if (serverSelected) {
      if (serverSelected.apiUrl !== Cookies.get('instance')) {
        router.push({query: {rpc: `${serverSelected.apiUrl}`}}, undefined, {
          shallow: true,
        });
        Cookies.set('instance', serverSelected.apiUrl);
        router.reload();
      }
    }
  }, [serverSelected]);

  return (
    <div className={styles.root} data-testid={'menu-test'}>
      <BoxComponent paddingLeft={0} paddingRight={0}>
        <div className={styles.head} onClick={gotoHome} aria-hidden="true">
          <img src={logo} width={220} height={48} />
        </div>

        <div className={styles.instance}>
          <SelectServer
            title={i18n.t('Login.Options.Prompt_Select_Instance.Switch')}
            onServerSelect={server => toggleSelected(server)}
          />
        </div>

        {menu
          .filter(ar => ar.isDesktop === true)
          .map(item => (
            <ListItemComponent
              data-testid={`list-item-${item.id}`}
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
