import {LogoutIcon} from '@heroicons/react/outline';
import {MenuIcon} from '@heroicons/react/solid';

import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useMenuList} from 'src/components/Menu/use-menu-list';
import {Metric} from 'src/components/Metric';
import {useStyles} from 'src/components/Mobile/MenuDrawer/menuDrawer.style';
import {ProfileContent} from 'src/components/ProfileCard';
import {ListItemComponent} from 'src/components/atoms/ListItem';

export const MenuDrawerComponent: React.FC = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const style = useStyles();
  const menu = useMenuList('home');
  const iconSyles = [style.icon];

  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
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
                user={undefined}
                alias={'Anonymous'}
                notificationCount={0}
                onShowNotificationList={console.log}
                onViewProfile={console.log}
                isMobile={true}
              />
              {/* metric */}
              <Metric official={false} />
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
                  url={item.url}
                />
              ))}
            </div>
          </div>
          {/* Logout */}
          <div className={style.logout}>
            <ListItem component="div" className={style.logoutListItem} ContainerComponent="div">
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
