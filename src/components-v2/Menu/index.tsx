import React from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import MyriadIcon from '../../images/web/myriad.svg';
import {BoxComponent} from '../common/Box';
import {ListItemComponent} from '../common/ListItem';
import {useMenuList, MenuDetail} from './use-menu-list';

type MenuProps = {
  icons: string[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',

      '&::before': {
        content: '""',
        position: 'absolute',
        top: 46,
        width: 10,
        height: 60,
        borderRadius: theme.spacing(0, 1.25, 1.25, 0),
        background: theme.palette.primary.main,
      },
    },
    head: {
      marginTop: 30,
      marginBottom: 32,
    },
  }),
);

export const Menu: React.FC<MenuProps> = () => {
  const styles = useStyles();

  const menu = useMenuList();

  const openMenu = (item: MenuDetail) => () => {
    console.log(item);
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
          />
        ))}
      </BoxComponent>
    </div>
  );
};
