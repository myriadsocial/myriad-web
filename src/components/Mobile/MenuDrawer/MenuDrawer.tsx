import { LogoutIcon } from '@heroicons/react/outline';
import { MenuIcon } from '@heroicons/react/solid';

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Drawer,
  Grid,
  SvgIcon,
  Typography,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';

import { NetworkOption } from 'components/ProfileCard/NetworkOption/NetworkOption';
import SelectServer, { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { CommonWalletIcon } from 'components/atoms/Icons';
import { useEnqueueSnackbar } from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import ShowIf from 'components/common/show-if.component';
import {
  useMenuList,
  MenuId,
  MenuDetail,
} from 'src/components/Menu/use-menu-list';
import { Metric } from 'src/components/Metric';
import { useStyles } from 'src/components/Mobile/MenuDrawer/menuDrawer.style';
import { PromptComponent } from 'src/components/Mobile/PromptDrawer/Prompt';
import { ProfileContent } from 'src/components/ProfileCard';
import { ListItemComponent } from 'src/components/atoms/ListItem';
import { formatAddress } from 'src/helpers/wallet';
import { useAuthHook } from 'src/hooks/auth.hook';
import { useInstances } from 'src/hooks/use-instances.hooks';
import { useUserHook } from 'src/hooks/use-user.hook';
import { ServerListProps } from 'src/interfaces/server-list';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { NotificationState } from 'src/reducers/notification/reducer';

export const MenuDrawerComponent: React.FC = () => {
  const { total } = useSelector<RootState, NotificationState>(
    state => state.notificationState,
  );

  const [selected, setSelected] = React.useState<MenuId>('home');
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openPromptDrawer, setOpenPromptDrawer] = React.useState(false);
  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);
  const { switchInstance, loadingSwitch, onLoadingSwitch } = useInstances();

  const { logout } = useAuthHook();
  const {
    user,
    alias,
    anonymous,
    userWalletAddress,
    networks,
    currentWallet,
    wallets,
  } = useUserHook();
  const enqueueSnackbar = useEnqueueSnackbar();

  const router = useRouter();
  const menu = useMenuList(selected);
  const style = useStyles();

  const [register, setRegister] = useState(false);

  const iconStyles = [style.icon];

  React.useEffect(() => {
    parseSelected(router.pathname);
  }, [router]);

  React.useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  const handleCancel = () => {
    setOpenPromptDrawer(false);
  };

  const parseSelected = (path: string) => {
    switch (path) {
      case '/experience':
        setSelected('experience');
        break;
      case '/wallet':
        setSelected('wallet');
        break;
      case '/friends':
        setSelected('friends');
        break;
      case '/socialtoken':
        setSelected('token');
        break;
      case '/town':
        setSelected('town');
        break;
      case '/nft':
        setSelected('nft');
        break;
      case '/topic':
        setSelected('trends');
        break;
      case '/socials':
        setSelected('socials');
        break;
      case '/settings':
        setSelected('settings');
        break;
      default:
        break;
    }
  };

  const handleConnectWeb3Wallet = () => {
    router.push(`/wallet?type=manage`);
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleSignOut = async () => {
    await logout(`/?instance=${cookies[COOKIE_INSTANCE_URL]}`);
  };

  const handleLoginOrCreateAccount = () => {
    router.push({
      pathname: '/login',
      query: { instance: cookies[COOKIE_INSTANCE_URL] },
    });
  };

  const openMenu = (item: MenuDetail) => () => {
    if (item.url === '/wallet' && !user) {
      setOpenPromptDrawer(true);
    } else {
      router.push(item.url);
    }
  };

  const handleShowNotification = () => {
    router.push(`/notification`);
  };

  const handleViewProfile = () => {
    if (user && !anonymous) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleSwitchInstance = async (
    server: ServerListProps,
    callback?: () => void,
  ) => {
    try {
      await switchInstance(server);

      callback && callback();
    } catch (err) {
      if (err.message === 'AccountNotFound') {
        setRegister(true);
      } else {
        enqueueSnackbar({ message: err.message, variant: 'error' });
      }

      onLoadingSwitch(false);
    }
  };

  return (
    <>
      <SvgIcon
        classes={{ root: style.fill }}
        component={MenuIcon}
        viewBox="0 0 20 20"
        style={{ width: 25, height: 25 }}
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
                networks={networks}
                notificationCount={total}
                onShowNotificationList={handleShowNotification}
                onViewProfile={handleViewProfile}
                isMobile={true}
                userWalletAddress={userWalletAddress}
              />
              {/* network */}
              <div className={style.wallet}>
                <ShowIf condition={anonymous}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLoginOrCreateAccount}>
                    Sign in or Create an Account
                  </Button>
                </ShowIf>
                <ShowIf condition={!anonymous}>
                  <ShowIf condition={Boolean(currentWallet)}>
                    <NetworkOption
                      currentWallet={currentWallet}
                      wallets={wallets}
                      networks={networks}
                      isMobile={true}
                    />

                    <Typography component="div" className={style.address}>
                      {formatAddress(currentWallet, userWalletAddress)}
                    </Typography>
                  </ShowIf>
                  <ShowIf condition={!anonymous && !wallets.length}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleConnectWeb3Wallet}>
                      <CommonWalletIcon viewBox="1 -3.5 20 20" />
                      <span style={{ paddingLeft: '5px' }}>
                        Connect Web 3.0 wallet
                      </span>
                    </Button>
                  </ShowIf>
                </ShowIf>
              </div>
              {/* metric */}
              <Metric
                official={false}
                data={user?.metric}
                anonymous={anonymous}
              />
            </div>

            <div className={style.instance}>
              <SelectServer
                title={i18n.t('Login.Options.Prompt_Select_Instance.Switch')}
                onSwitchInstance={handleSwitchInstance}
                register={register}
                setRegister={value => setRegister(value)}
                page="layout"
              />
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
                  isAnimated={item.isAnimated}
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
              disabled={anonymous ? true : false}
              onClick={
                anonymous ? () => console.log('disabled!') : handleSignOut
              }>
              <ListItemIcon className={iconStyles.join(' ')}>
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
        <PromptComponent
          title={'Wallet'}
          subtitle={
            'When you join Myriad, you can connect your wallet and start send tips on some post!'
          }
          open={openPromptDrawer}
          onCancel={handleCancel}
        />
      </Drawer>
      <Backdrop className={style.backdrop} open={loadingSwitch}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default MenuDrawerComponent;
