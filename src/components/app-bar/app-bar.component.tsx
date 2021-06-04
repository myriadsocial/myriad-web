import React from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { useTheme } from '@material-ui/core/styles';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';

import { useMyriadUser } from '../timeline/use-users.hooks';
import { MobileMenuComponent } from './mobile-menu.component';

import clsx from 'clsx';
import { useLayoutSetting } from 'src/context/layout.context';
import { useLayout } from 'src/hooks/use-layout.hook';
import LogoImageCompact from 'src/images/header-logo-compact.svg';
import LogoImage from 'src/images/header-logo.svg';
import { SidebarTab } from 'src/interfaces/sidebar';
import { User as MyriadUser } from 'src/interfaces/user';

const SearchUserComponent = dynamic(() => import('../timeline/search-user.component'));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      }
    },
    logo: {
      display: 'flex',
      width: 327,
      margin: theme.spacing(0.5),
      [theme.breakpoints.down('sm')]: {
        width: 56
      }
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
        backgroundColor: fade(theme.palette.primary.main, 0.25)
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: theme.spacing(1),
        width: 288
      },

      '& .MuiFormLabel-root': {
        color: '#5F5C5C'
      }
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
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch'
      }
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        justifyContent: 'space-around',
        width: 331
      }
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },

    iconActive: {
      background: theme.palette.secondary.light
    }
  })
);

export default function HeaderBar() {
  const classes = useStyles();

  const theme = useTheme();
  const {
    state: { selectedSidebarMenu }
  } = useLayoutSetting();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { changeSelectedSidebar } = useLayout();

  const { users: options, search } = useMyriadUser();

  const searchUser = (text: string) => {
    search(text);
    console.log('searching');
  };

  const onSearchUser = (users: MyriadUser) => {
    //console.log('the users are: ', users);
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.logo}>
            <Link href="/home">
              <a>{isMobile ? <LogoImageCompact /> : <LogoImage />}</a>
            </Link>
          </div>
          <div className={classes.grow} />
          <div className={classes.search}>
            <SearchUserComponent
              title={isMobile ? 'Search on Myria' : 'Search for people on Myriad'}
              data={options}
              search={searchUser}
              onSelected={onSearchUser}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              className={clsx({
                [classes.iconActive]: selectedSidebarMenu === SidebarTab.FRIENDS
              })}
              aria-label="friends"
              color="inherit"
              style={{ margin: '0 32px' }}
              onClick={() => changeSelectedSidebar(SidebarTab.FRIENDS)}>
              <Badge badgeContent={4} color="secondary">
                <PeopleIcon />
              </Badge>
            </IconButton>
            <IconButton
              className={clsx({
                [classes.iconActive]: selectedSidebarMenu === SidebarTab.NOTIFICATION
              })}
              aria-label="notifications"
              color="inherit"
              style={{ margin: '0 32px' }}
              onClick={() => changeSelectedSidebar(SidebarTab.NOTIFICATION)}>
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {isMobile && <MobileMenuComponent onChange={changeSelectedSidebar} />}
    </div>
  );
}
