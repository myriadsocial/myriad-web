import {SearchIcon} from '@heroicons/react/solid';

import React from 'react';

import {SvgIcon} from '@material-ui/core';
import {Grid} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MenuDrawerComponent} from 'src/components/Mobile/MenuDrawer/MenuDrawer';
import {MyriadFullIcon} from 'src/components/atoms/Icons';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'flex',
        width: '100%',
        background: '#FFF',
        height: '56px',
        padding: theme.spacing(0, 4),
      },
    },
    fill: {
      fill: 'currentColor',
      color: '#404040',
    },
  }),
);

export const NavbarComponent: React.FC = () => {
  const style = useStyles();
  return (
    <Grid container alignItems="center" justifyContent="space-between" className={style.root}>
      <MenuDrawerComponent />
      <MyriadFullIcon width={105} height={25} />
      <SvgIcon
        classes={{root: style.fill}}
        component={SearchIcon}
        viewBox="0 0 20 20"
        style={{width: 25, height: 25}}
      />
    </Grid>
  );
};
