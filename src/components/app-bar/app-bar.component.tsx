import React, {useEffect} from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {useTheme} from '@material-ui/core/styles';
import {fade, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {useMyriadUser} from 'src/hooks/use-myriad-users.hooks';
import LogoImageCompact from 'src/images/header-logo-compact.svg';
import LogoImage from 'src/images/header-logo.svg';

const SearchUserComponent = dynamic(() => import('../search/search.component'));
const DesktopMenuComponent = dynamic(() => import('./desktop-menu.component'));
const MobileMenuComponent = dynamic(() => import('./mobile-menu.component'));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    logo: {
      display: 'flex',
      width: 327,
      margin: theme.spacing(0.5),
      [theme.breakpoints.down('sm')]: {
        width: 56,
      },
    },
    search: {
      position: 'relative',
      // marginRight: theme.spacing(8),
      // marginLeft: theme.spacing(2),
      // paddingLeft: 262,
      width: 678,
      // width: '100%',
      backgroundColor: fade(theme.palette.primary.main, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.25),
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: theme.spacing(1),
        width: 288,
      },

      '& .MuiFormLabel-root': {
        color: '#5F5C5C',
      },
    },
    //searchIcon: {
    //padding: theme.spacing(0, 2),
    //height: '100%',
    //position: 'absolute',
    //pointerEvents: 'none',
    //display: 'flex',
    //alignItems: 'center',
    //justifyContent: 'center'
    //},
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        justifyContent: 'space-around',
        width: 331,
      },
    },
  }),
);

export default function HeaderBar(): JSX.Element {
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {load} = useMyriadUser();

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.logo}>
            <Link href="/home">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>{isMobile ? <LogoImageCompact /> : <LogoImage />}</a>
            </Link>
          </div>
          <div className={classes.grow} />
          <div className={classes.search}>
            <SearchUserComponent
              placeholder={
                isMobile ? 'Search Myria...' : 'Search for people or topics on Myriad...'
              }
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop} id="user-menu">
            <DesktopMenuComponent />
          </div>
        </Toolbar>
      </AppBar>
      {isMobile && <MobileMenuComponent />}
    </div>
  );
}
