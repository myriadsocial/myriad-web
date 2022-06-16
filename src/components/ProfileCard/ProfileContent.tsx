import React from 'react';

import {useRouter} from 'next/router';

import {Badge, Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {NotificationIcon} from '../atoms/Icons';
import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './profileContent.style';

import ShowIf from 'components/common/show-if.component';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import {Modal} from 'src/components/atoms/Modal';
import {formatCount} from 'src/helpers/number';
import {formatNetworkTitle, formatWalletTitle} from 'src/helpers/wallet';
import {NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import i18n from 'src/locale';

export const ProfileContent: React.FC<ProfileCardProps> = props => {
  const {
    user,
    anonymous,
    alias,
    notificationCount,
    onViewProfile,
    onShowNotificationList,
    isMobile,
    handleSignOut,
    currentWallet,
  } = props;
  const classes = useStyles({...props});

  const router = useRouter();

  const icons = React.useMemo(
    () => ({
      'polkadot{.js}': <PolkadotNetworkIcon />,
      kusama: <KusamaNetworkIcon />,
      near: <NearNetworkIcon24 />,
      myriad: <MyriadCircleIcon />,
    }),
    [],
  );
  const [open, setOpen] = React.useState(false);

  const handleOpenProfile = () => {
    if (isMobile) {
      router.push(`/profile/${user.id}`);
    } else {
      !anonymous && setOpen(!open);
    }
  };

  const getSelectedIcon = (isWallet?: boolean) => {
    const networkId = currentWallet?.networkId;

    if (isWallet) {
      switch (networkId) {
        case NetworkIdEnum.NEAR:
          return icons[WalletTypeEnum.NEAR];

        default:
          return icons[WalletTypeEnum.POLKADOT];
      }
    }

    return networkId && icons[networkId as keyof typeof icons];
  };

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={classes.profileContent}>
        <div className={classes.flex}>
          <div className={`${classes.avatar} ${classes.hover}`}>
            <Avatar
              src={user?.profilePictureURL}
              size={isMobile ? AvatarSize.LARGE : AvatarSize.MEDIUM}
              name={user?.name || alias}
              onClick={handleOpenProfile}
            />
          </div>
          <div className={classes.identity}>
            <Typography
              onClick={handleOpenProfile}
              component="a"
              variant="h5"
              className={classes.name}>
              {user?.name || alias || ''}
            </Typography>

            <Typography variant="caption" color="textSecondary" className={classes.username}>
              @{user?.username || 'anonymous'}
            </Typography>
          </div>
        </div>
        <ShowIf condition={Boolean(user?.username)}>
          <div className={classes.notification}>
            <IconButton aria-label="avatar" disabled={!!alias} onClick={onShowNotificationList}>
              <Badge
                invisible={notificationCount === 0}
                badgeContent={formatCount(notificationCount)}
                color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </div>
        </ShowIf>
      </Grid>
      <Modal title={i18n.t('Profile_Card.Account')} onClose={handleOpenProfile} open={open}>
        <div className={classes.modal}>
          <div className={classes.purple}>
            <div className={classes.flex}>
              <div className={classes.avatar}>
                <Avatar
                  src={user?.profilePictureURL}
                  size={isMobile ? AvatarSize.LARGE : AvatarSize.MEDIUM}
                  name={user?.name || alias}
                />
              </div>
              <div className={classes.identity}>
                <Typography variant="h5" className={classes.username}>
                  {user?.name || alias || ''}
                </Typography>
                <Typography variant="caption" className={classes.username}>
                  @{user?.username || 'anonymous'}
                </Typography>
              </div>
            </div>
            <div className={classes.column}>
              <Typography component="span">{i18n.t('Profile_Card.Network')}</Typography>
              <Typography component="span" className={classes.flex}>
                {getSelectedIcon()} {formatNetworkTitle(currentWallet?.network)}
              </Typography>
            </div>
            <div className={classes.column}>
              <Typography component="span">{i18n.t('Profile_Card.Wallet')}</Typography>
              <Typography component="span" className={classes.flex}>
                {getSelectedIcon(true)}
                {formatWalletTitle(currentWallet?.network)}
              </Typography>
            </div>
          </div>
          <div className={`${classes.flex} ${classes.mt2}`}>
            <Button
              variant="text"
              color="primary"
              size="small"
              className={classes.button}
              onClick={onViewProfile}>
              {i18n.t('Profile_Card.Profile')}
            </Button>
            <div className={classes.line} />
            <Button
              variant="text"
              color="primary"
              size="small"
              className={classes.button}
              onClick={handleSignOut}>
              {i18n.t('Profile_Card.Logout')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileContent;
