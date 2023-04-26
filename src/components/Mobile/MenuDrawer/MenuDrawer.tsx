import { DotsHorizontalIcon, LogoutIcon } from '@heroicons/react/outline';

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

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
  IconButton,
} from '@material-ui/core';

import { CustomMyriadIcon } from '../Bottombar/Bottombar';

import { CustomSearchIcon } from 'components/Menu';
import { NetworkOption } from 'components/ProfileCard/NetworkOption/NetworkOption';
import ExperienceTab from 'components/RightMenuBar/tabs/ExperienceTab';
import TrendingExperienceTab from 'components/RightMenuBar/tabs/TrendingExperienceTab';
import SelectServer, { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { CommonWalletIcon } from 'components/atoms/Icons';
import { useEnqueueSnackbar } from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import ShowIf from 'components/common/show-if.component';
import {
  useMenuRightList,
  MenuRightId,
  MenuRightDetail,
} from 'src/components/Menu/use-menu-list';
import { useStyles } from 'src/components/Mobile/MenuDrawer/menuDrawer.style';
import { PromptComponent } from 'src/components/Mobile/PromptDrawer/Prompt';
import { ListItemComponent } from 'src/components/atoms/ListItem';
import { formatAddress } from 'src/helpers/wallet';
import { useAuthHook } from 'src/hooks/auth.hook';
import { useInstances } from 'src/hooks/use-instances.hooks';
import { useUserHook } from 'src/hooks/use-user.hook';
import { ServerListProps } from 'src/interfaces/server-list';
import i18n from 'src/locale';

export const MenuDrawerComponent: React.FC = () => {
  const [selected, setSelected] = React.useState<MenuRightId>();
  const [showMenu, setShowMenu] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openPromptDrawer, setOpenPromptDrawer] = React.useState(false);
  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);
  const { switchInstance, loadingSwitch, onLoadingSwitch } = useInstances();

  const { logout } = useAuthHook();
  const {
    user,
    anonymous,
    userWalletAddress,
    networks,
    currentWallet,
    wallets,
  } = useUserHook();
  const enqueueSnackbar = useEnqueueSnackbar();

  const router = useRouter();
  const menu = useMenuRightList(selected);
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

  const openMenu = (item: MenuRightDetail) => () => {
    if (item.url === '/wallet' && !user) {
      setOpenPromptDrawer(true);
    } else {
      router.push(item.url);
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
      <IconButton onClick={handleOpenDrawer} className={style.iconbutton}>
        <SvgIcon component={CustomMyriadIcon} />
      </IconButton>
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

            <div>
              {/* timeline */}
              <ShowIf condition={!anonymous}>
                <div>
                  <Grid
                    container
                    wrap="nowrap"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ padding: '0px 20px', marginBottom: 14 }}>
                    <Typography
                      variant={'h6'}
                      color={'textPrimary'}
                      component="span">
                      {i18n.t(`Section.Mytimelines`)}
                    </Typography>
                    <Typography
                      variant={'h6'}
                      color={'primary'}
                      component="span"
                      onClick={() => router.push('/experience')}>
                      {i18n.t(`General.ViewMore`)}
                    </Typography>
                  </Grid>
                  <ExperienceTab menuDrawer />
                </div>
              </ShowIf>
              <div style={{ padding: '0px 20px', margin: '12px 0 20px 0' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => router.push('/experience/discover')}
                  startIcon={<SvgIcon component={CustomSearchIcon} />}
                  style={{
                    justifyContent: 'flex-start',
                    paddingLeft: '30px',
                    backgroundColor: 'transparent',
                  }}
                  fullWidth>
                  {i18n.t('Experience.New.Discover')}
                </Button>
              </div>

              <div>
                <Grid
                  container
                  wrap="nowrap"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ padding: '0px 20px', marginBottom: 14 }}>
                  <Typography
                    variant={'h6'}
                    color={'textPrimary'}
                    component="span">
                    {i18n.t('Section.Trending_Experience')}
                  </Typography>
                  <Typography
                    variant={'h6'}
                    color={'primary'}
                    component="span"
                    onClick={() => router.push('/experience/trending')}>
                    {i18n.t(`General.ViewMore`)}
                  </Typography>
                </Grid>
                <TrendingExperienceTab menuDrawer />
              </div>
            </div>
            {/* Menu list */}
            <ShowIf condition={!showMenu}>
              <div className={style.more}>
                <ListItem
                  component="div"
                  className={style.logoutListItem}
                  ContainerComponent="div"
                  onClick={() => setShowMenu(true)}>
                  <ListItemIcon className={iconStyles.join(' ')}>
                    <SvgIcon component={DotsHorizontalIcon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        component="div"
                        variant="h5"
                        color="textPrimary">
                        {i18n.t(`General.More`)}
                      </Typography>
                    }
                  />
                </ListItem>
              </div>
            </ShowIf>

            <ShowIf condition={showMenu}>
              <div className={style.menu}>
                {menu.map(item => {
                  if (item.id !== 'town')
                    return (
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
                    );
                })}
              </div>
            </ShowIf>
          </div>

          {/* Logout */}
          <ShowIf condition={!anonymous}>
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
          </ShowIf>
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
