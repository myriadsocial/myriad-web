import {LogoutIcon} from '@heroicons/react/outline';
import {MenuIcon} from '@heroicons/react/solid';

import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useMenuList, MenuId, MenuDetail} from 'src/components/Menu/use-menu-list';
import {Metric} from 'src/components/Metric';
import {useStyles} from 'src/components/Mobile/MenuDrawer/menuDrawer.style';
import {ProfileContent} from 'src/components/ProfileCard';
import {ListItemComponent} from 'src/components/atoms/ListItem';
import {useAuthHook} from 'src/hooks/auth.hook';
import {RootState} from 'src/reducers';
import {clearUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const MenuDrawerComponent: React.FC = () => {
  const {user, alias} = useSelector<RootState, UserState>(state => state.userState);
  const [selected, setSelected] = React.useState<MenuId>('home');
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const {logout} = useAuthHook();
  const router = useRouter();
  const dispatch = useDispatch();
  const [session] = useSession();
  const menu = useMenuList(selected);
  const style = useStyles();

  const iconSyles = [style.icon];

  React.useEffect(() => {
    parseSelected(router.pathname);
  }, [router]);

  const parseSelected = (path: string) => {
    switch (path) {
      case '/friends':
        setSelected('friends');
        break;
      case '/socialtoken':
        setSelected('token');
        break;
      case '/nft':
        setSelected('nft');
        break;
      case '/settings':
        setSelected('settings');
        break;
      default:
        break;
    }
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleSignOut = async () => {
    if (session) {
      logout();
    } else {
      dispatch(clearUser());
      await router.push(`/`);
    }
  };

  const openMenu = (item: MenuDetail) => () => {
    router.push(item.url);
  };

  return (
    <>
      <SvgIcon
        classes={{root: style.fill}}
        component={MenuIcon}
        viewBox="0 0 20 20"
        style={{width: 25, height: 25}}
        onClick={handleOpenDrawer}
      />
      <Drawer anchor={'left'} open={openDrawer} onClose={handleOpenDrawer}>
        <Grid
          container
          direction="column"
          wrap="nowrap"
          justifyContent="space-between"
          alignItems="center"
          className={style.root}>
          <div className={style.content}>
            <div className={style.profileCard}>
              {/* profileCard */}
              <ProfileContent
                user={user}
                alias={alias}
                notificationCount={0}
                onShowNotificationList={console.log}
                onViewProfile={console.log}
                isMobile={true}
              />
              {/* metric */}
              <Metric official={false} data={user?.metric} />
            </div>
            {/* Menu list */}
            <div className={style.menu}>
              {menu.map(item => (
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
            </div>
          </div>
          {/* Logout */}
          <div className={style.logout}>
            <ListItem
              component="div"
              className={style.logoutListItem}
              ContainerComponent="div"
              onClick={handleSignOut}>
              <ListItemIcon className={iconSyles.join(' ')}>
                <SvgIcon color="error" component={LogoutIcon} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography component="div" variant="h5" color="error">
                    Logout
                  </Typography>
                }
              />
            </ListItem>
          </div>
        </Grid>
      </Drawer>
    </>
  );
};

export default MenuDrawerComponent;
