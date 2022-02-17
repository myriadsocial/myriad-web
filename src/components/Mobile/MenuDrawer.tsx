import {LogoutIcon} from '@heroicons/react/outline';
import {MenuIcon} from '@heroicons/react/solid';

import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {useMenuList} from 'src/components/Menu/use-menu-list';
import {CustomAvatar, CustomAvatarSize} from 'src/components/atoms/Avatar';
import {NotificationIcon} from 'src/components/atoms/Icons';
import {ListItemComponent} from 'src/components/atoms/ListItem';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#F6F7FC',
      position: 'fixed',
      overflow: 'auto',
      height: '100vh',
      width: '284px',
      zIndex: 99999,
      left: 0,
      top: 0,
    },
    content: {
      width: '100%',
    },
    profileCard: {
      borderRadius: '0px 0px 20px 20px;',
      padding: '28px 20px 20px 20px',
      background: '#FFF',
      width: '100%',
    },
    profile: {
      marginBottom: theme.spacing(3),
    },
    avatar: {
      marginRight: 8,
    },
    flex: {
      alignItems: 'center',
      display: 'flex',
    },
    name: {fontWeight: theme.typography.fontWeightMedium},
    notification: {},
    metric: {},
    title: {
      fontWeight: theme.typography.fontWeightRegular,
    },
    total: {
      fontWeight: theme.typography.fontWeightMedium,
    },
    menu: {
      padding: '20px',
    },
    logout: {
      borderTop: '1px solid #DECCFF',
      paddingRight: '20px',
      marginBottom: '12px',
      paddingLeft: '20px',
      width: '100%',
      height: 52,
    },
    logoutListItem: {
      paddingLeft: 0,
    },
    icon: {
      marginRight: 20,
      minWidth: 24,
      padding: 6,
    },
    fill: {
      fill: 'currentColor',
      color: '#404040',
    },
    screen: {
      background: 'rgba(0, 0, 0, 0.25)',
      position: 'fixed',
      zIndex: 9998,
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
    },
  }),
);

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
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                className={style.profile}>
                <div className={style.flex}>
                  <div className={style.avatar}>
                    <CustomAvatar avatar={''} size={CustomAvatarSize.LARGE} name={'A'} />
                  </div>
                  <div>
                    <Typography className={style.name} variant="h4">
                      {'Anonymous'}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      @{'anonymous'}
                    </Typography>
                  </div>
                </div>
                <div className={style.notification}>
                  <IconButton aria-label="avatar" disabled>
                    <NotificationIcon />
                  </IconButton>
                </div>
              </Grid>
              {/* metric */}
              <Grid container spacing={2} wrap="nowrap" classes={{root: style.metric}}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" className={style.title} component="p">
                    Kudos
                  </Typography>
                  <Typography variant="h4" className={style.total} component="p">
                    0
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" className={style.title} component="p">
                    Friends
                  </Typography>
                  <Typography variant="h4" className={style.total} component="p">
                    1
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" className={style.title} component="p">
                    Experience
                  </Typography>
                  <Typography variant="h4" className={style.total} component="p">
                    3
                  </Typography>
                </Grid>
              </Grid>
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
