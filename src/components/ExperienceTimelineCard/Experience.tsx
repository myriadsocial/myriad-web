import { DuplicateIcon } from '@heroicons/react/outline';

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import CopyToClipboard from 'react-copy-to-clipboard';

import getConfig from 'next/config';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Avatar, Grid } from '@material-ui/core';
import { TextField, InputAdornment } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import BaseMenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import useConfirm from '../common/Confirm/use-confirm.hook';
import { useStyles } from './Experience.style';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { WithAuthorizeAction } from 'components/common/Authorization/WithAuthorizeAction';
import { useEnqueueSnackbar } from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import { Modal } from 'src/components/atoms/Modal';
import ShowIf from 'src/components/common/show-if.component';
import { capitalize } from 'src/helpers/string';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { WrappedExperience } from 'src/interfaces/experience';
import { User } from 'src/interfaces/user';
import i18n from 'src/locale';

type ExperienceProps = {
  user?: User;
  anonymous?: boolean;
  userExperience: WrappedExperience;
  selected: boolean;
  selectable: boolean;
  onSelect?: (experienceId: string) => void;
  onClone?: (experienceId: string) => void;
  onSubscribe?: (experienceId: string) => void;
  onUnsubscribe?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
  menuDrawer?: boolean;
};

const MenuItem = WithAuthorizeAction(BaseMenuItem);

const DEFAULT_IMAGE =
  'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg';

const { publicRuntimeConfig } = getConfig();

export const Experience: React.FC<ExperienceProps> = props => {
  const {
    userExperience,
    user,
    anonymous = false,
    selectable,
    onSelect,
    onClone,
    onDelete,
    onSubscribe,
    onUnsubscribe,
    menuDrawer = false,
  } = props;

  const router = useRouter();
  const styles = useStyles({ ...props, menuDrawer });
  const confirm = useConfirm();
  const enqueueSnackbar = useEnqueueSnackbar();

  const [menuAnchorElement, setMenuAnchorElement] =
    useState<null | HTMLElement>(null);
  const [shareAnchorElement, setShareAnchorElement] =
    useState<null | HTMLElement>(null);

  const isOwnExperience = userExperience.experience.user.id === user?.id;
  const experienceId = userExperience.experience.id;
  const userExperienceId = userExperience.id;
  const link = publicRuntimeConfig.appAuthURL + `?type=all&id=${experienceId}`;
  const { userExperiencesMeta } = useExperienceHook();
  const totalOwnedExperience =
    userExperiencesMeta.additionalData?.totalOwnedExperience ?? 0;

  const handleClickExperience = () => {
    handleCloseSettings();

    if (selectable && onSelect) {
      onSelect(experienceId);
    }
  };

  const handleCloneExperience = () => {
    if (
      totalOwnedExperience >= 5 &&
      !user.fullAccess &&
      user.fullAccess !== undefined
    ) {
      confirm({
        title: i18n.t('LiteVersion.LimitTitleExperience'),
        description: i18n.t('LiteVersion.LimitDescExperience'),
        icon: 'warning',
        confirmationText: i18n.t('LiteVersion.ConnectWallet'),
        cancellationText: i18n.t('LiteVersion.MaybeLater'),
        onConfirm: () => {
          router.push({ pathname: '/wallet', query: { type: 'manage' } });
        },
        onCancel: () => {
          undefined;
        },
      });
    } else {
      handleCloseSettings();

      if (onClone) {
        onClone(experienceId);
      }
    }
  };

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const handleSubscribeExperience = () => {
    handleCloseSettings();

    if (!user) {
      confirm({
        icon: 'followTimeline',
        title: i18n.t('Confirm.Anonymous.FollowTimeline.Title'),
        description: i18n.t('Confirm.Anonymous.FollowTimeline.Desc'),
        confirmationText: i18n.t('General.SignIn'),
        cancellationText: i18n.t('LiteVersion.MaybeLater'),
        onConfirm: () => {
          router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
        },
      });
    } else {
      if (onSubscribe) {
        onSubscribe(experienceId);
      }
    }
  };

  const handleCloseSettings = () => {
    setMenuAnchorElement(null);
  };

  const confirmDeleteExperience = () => {
    handleCloseSettings();

    confirm({
      title: i18n.t('Experience.List.Prompt_Delete.Title'),
      description: i18n.t('Experience.List.Prompt_Delete.Desc'),
      icon: 'danger',
      confirmationText: i18n.t('Experience.List.Prompt_Delete.Btn_Yes'),
      cancellationText: i18n.t('General.Cancel'),
      onConfirm: () => {
        if (onDelete && userExperienceId) {
          onDelete(userExperienceId);
        }
      },
    });
  };

  const confirmUnsubscribe = () => {
    handleCloseSettings();

    confirm({
      title: i18n.t('Experience.List.Prompt_Unsub.Title'),
      description: `${i18n.t('Experience.List.Prompt_Unsub.Desc_1')}\n ${i18n.t(
        'Experience.List.Prompt_Unsub.Desc_2',
        { experience_name: userExperience.experience.name },
      )}`,
      icon: 'warning',
      confirmationText: i18n.t('Experience.List.Prompt_Unsub.Btn_Yes'),
      onConfirm: () => {
        if (onUnsubscribe && userExperienceId) {
          onUnsubscribe(userExperienceId);
        }
      },
    });
  };

  const openShareExperience = (event: React.MouseEvent<HTMLLIElement>) => {
    console.log(event.currentTarget);
    handleCloseSettings();

    setShareAnchorElement(event.currentTarget);
  };

  const closeShareExperience = () => {
    setShareAnchorElement(null);
  };

  const handleExperienceLinkCopied = () => {
    enqueueSnackbar({
      message: i18n.t('Experience.List.Copy'),
      variant: 'success',
    });
  };

  const isHidden = () => {
    if (userExperience.private && !userExperience.friend) return true;
    if (userExperience.private && userExperience.friend) return false;
    return false;
  };

  return (
    <>
      <Card className={styles.root}>
        <CardActionArea
          onClick={handleClickExperience}
          disableRipple
          component="div">
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            wrap="nowrap">
            {userExperience.experience.experienceImageURL ? (
              <div
                style={{
                  maxWidth: menuDrawer ? 40 : 68,
                  maxHeight: menuDrawer ? 40 : 68,
                }}>
                <NextImage
                  alt={userExperience.experience.name}
                  loader={() =>
                    userExperience.experience.experienceImageURL ??
                    DEFAULT_IMAGE
                  }
                  src={
                    userExperience.experience.experienceImageURL ??
                    DEFAULT_IMAGE
                  }
                  placeholder="empty"
                  objectFit="cover"
                  objectPosition="center"
                  width={'100%'}
                  height={'100%'}
                  quality={90}
                  className={styles.image}
                />
              </div>
            ) : (
              <Avatar
                alt={userExperience.experience.name}
                variant="rounded"
                className={styles.image}>
                {userExperience.experience.name.charAt(0)}
              </Avatar>
            )}

            <CardContent classes={{ root: styles.cardContent }}>
              <Typography className={styles.title} variant="body1">
                {userExperience.experience.name}
              </Typography>
              <Typography
                variant="caption"
                color="primary"
                className={styles.subtitle}>
                {userExperience.experience.user.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {isOwnExperience ? ` ${i18n.t('Experience.List.You')}` : ''}
              </Typography>
              <div className="">
                <Typography
                  variant="caption"
                  color="error"
                  className={styles.subtitle}>
                  Visibility:{' '}
                </Typography>
                <Typography
                  variant="caption"
                  color="error"
                  className={styles.subtitle}>
                  {userExperience.experience.visibility === 'selected_user'
                    ? 'Custom'
                    : capitalize(userExperience.experience.visibility)}
                </Typography>
              </div>
            </CardContent>
          </Grid>
        </CardActionArea>
      </Card>

      {menuAnchorElement && (
        <Menu
          classes={{
            paper: styles.menu,
          }}
          anchorEl={menuAnchorElement}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={Boolean(menuAnchorElement)}
          onClose={handleCloseSettings}>
          <Link
            href={`/experience/[experienceId]`}
            as={`/experience/${experienceId}`}
            passHref>
            <BaseMenuItem onClick={handleCloseSettings}>
              {i18n.t('Experience.List.Menu.View')}
            </BaseMenuItem>
          </Link>

          <ShowIf condition={isOwnExperience}>
            <Link
              href={`/experience/[experienceId]/edit`}
              as={`/experience/${experienceId}/edit`}
              passHref>
              <MenuItem onClick={handleCloseSettings}>
                {i18n.t('Experience.List.Menu.Edit')}
              </MenuItem>
            </Link>
          </ShowIf>

          <ShowIf condition={!isOwnExperience && !isHidden()}>
            <MenuItem
              onClick={handleCloneExperience}
              fallback={handleCloseSettings}
              disabled={anonymous}>
              {i18n.t('Experience.List.Menu.Clone')}
            </MenuItem>
          </ShowIf>

          <ShowIf
            condition={
              !userExperience.subscribed && !isOwnExperience && !isHidden()
            }>
            <MenuItem
              onClick={handleSubscribeExperience}
              fallback={handleCloseSettings}>
              {i18n.t('Experience.List.Menu.Subscribe')}
            </MenuItem>
          </ShowIf>

          <ShowIf
            condition={Boolean(userExperience.subscribed) && !isOwnExperience}>
            <MenuItem
              onClick={confirmUnsubscribe}
              fallback={handleCloseSettings}
              className={styles.delete}>
              {i18n.t('Experience.List.Menu.Unsubscribe')}
            </MenuItem>
          </ShowIf>
          <ShowIf condition={isOwnExperience}>
            <MenuItem
              onClick={confirmDeleteExperience}
              fallback={handleCloseSettings}
              className={styles.delete}>
              {i18n.t('Experience.List.Menu.Delete')}
            </MenuItem>
          </ShowIf>
          <BaseMenuItem onClick={openShareExperience}>
            {i18n.t('Experience.List.Menu.Share')}
          </BaseMenuItem>
        </Menu>
      )}

      <Modal
        title={i18n.t('Experience.List.Modal.Title')}
        subtitle={i18n.t('Experience.List.Modal.Subtitle')}
        maxWidth="sm"
        className={styles.modal}
        open={Boolean(shareAnchorElement)}
        onClose={closeShareExperience}>
        <div className={styles.copy}>
          <TextField
            id="copy-post-url"
            label="URL"
            value={link}
            variant="outlined"
            disabled
            fullWidth
            margin="none"
            className={styles.input}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CopyToClipboard
                    text={link}
                    onCopy={handleExperienceLinkCopied}>
                    <IconButton
                      aria-label="copy-post-link"
                      style={{ padding: 0 }}>
                      <SvgIcon component={DuplicateIcon} color="primary" />
                    </IconButton>
                  </CopyToClipboard>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Modal>
    </>
  );
};
