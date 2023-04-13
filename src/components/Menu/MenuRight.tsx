import React from 'react';
import { useCookies } from 'react-cookie';

import { useRouter } from 'next/router';

import { Backdrop, CircularProgress } from '@material-ui/core';

import { BoxComponent } from '../atoms/Box';
import { ListItemComponent } from '../atoms/ListItem';
import { useStyles } from './MenuRight.styles';
import {
  useMenuRightList,
  MenuRightId,
  MenuRightDetail,
} from './use-menu-list';

import useConfirm from 'components/common/Confirm/use-confirm.hook';
import { COOKIE_INSTANCE_URL } from 'src/components/SelectServer';
import { useInstances } from 'src/hooks/use-instances.hooks';
import i18n from 'src/locale';

type MenuProps = {
  selected: MenuRightId;
  onChange: (path: string) => void;
  logo: string;
  anonymous?: boolean;
};

export const MenuRight: React.FC<MenuProps> = props => {
  const { selected, onChange, anonymous } = props;

  const styles = useStyles();
  const router = useRouter();

  const confirm = useConfirm();

  const menu = useMenuRightList(selected);

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const { loadingSwitch } = useInstances();

  const openMenu = (item: MenuRightDetail) => () => {
    if (router.pathname === item.url) return;
    if (anonymous && item.url === '/friends') {
      confirm({
        icon: 'people',
        title: i18n.t('Confirm.Anonymous.People.Title'),
        description: i18n.t('Confirm.Anonymous.People.Desc'),
        confirmationText: i18n.t('General.SignIn'),
        cancellationText: i18n.t('LiteVersion.MaybeLater'),
        onConfirm: () => {
          router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
        },
      });
    } else {
      onChange(item.url);
    }
  };

  return (
    <div className={styles.root} data-testid={'menu-test'}>
      <BoxComponent paddingLeft={0} paddingRight={0}>
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
      <Backdrop className={styles.backdrop} open={loadingSwitch}>
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
};
