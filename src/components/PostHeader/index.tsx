import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';

import {useRouter} from 'next/router';

import {capitalize, Menu, Typography} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import BaseMenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';

import {SocialAvatar} from '../atoms/SocialAvatar';
import {PostHeaderProps} from './PostHeader.interface';
import {useStyles} from './postHeader.style';
import {PostSubHeader} from './subHeader/post-sub-header.component';

import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import useModalAddToPost from 'src/components/Expericence/ModalAddToPost/useModalAddToPost.hook';
import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';

const MenuItem = WithAuthorizeAction(BaseMenuItem);

/**
 * @deprecated moved to post header
 */
export const HeaderComponent: React.FC<PostHeaderProps> = props => {
  const {
    user,
    post,
    owner,
    disableAction = false,
    onDelete,
    onOpenTipHistory,
    onReport,
    onVisibility,
    onImporters,
  } = props;

  const style = useStyles();
  const router = useRouter();
  const addPostToExperience = useModalAddToPost();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenPostSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePostSetting = () => {
    setAnchorEl(null);
  };

  const openContentProfileUrl = (): void => {
    const url = getPlataformProfileUrl();

    switch (post.platform) {
      case 'myriad':
        router.push(url);
        break;
      default:
        window.open(url, '_blank');
        break;
    }
  };

  const getPlataformProfileUrl = (): string => {
    let url = '';

    if (!post.user) return url;

    switch (post.platform) {
      case SocialsEnum.TWITTER:
        url = `https://twitter.com/${post.people?.username as string}`;
        break;
      case SocialsEnum.REDDIT:
        url = `https://reddit.com/user/${post.people?.username as string}`;
        break;
      case 'myriad':
        url = `/profile/${post.createdBy}`;
        break;
      default:
        url = post.url;
        break;
    }

    return url;
  };

  const handleDelete = () => {
    onDelete();
    handleClosePostSetting();
  };

  const handlePostVisibility = () => {
    handleClosePostSetting();
    onVisibility();
  };

  const handleReport = () => {
    onReport();
    handleClosePostSetting();
  };

  const handleImporter = () => {
    onImporters();
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory();
    handleClosePostSetting();
  };

  const handleOpenAddPostToExperience = () => {
    handleClosePostSetting();
    const propsAddToPost = {
      post: post,
    };
    addPostToExperience(propsAddToPost);
  };

  const openPost = () => {
    router.push(`/post/${post.id}`);

    handleClosePostSetting();
  };

  const openUserProfile = () => {
    if (post.user) {
      router.push(`/profile/${post.user.id}`);
    }

    handleClosePostSetting();
  };

  const openSourcePost = () => {
    window.open(post.url, '_blank');

    handleClosePostSetting();
  };

  const openSourceAccount = () => {
    if (post.people) {
      const url = getPlataformProfileUrl();

      window.open(url, '_blank');
    }

    handleClosePostSetting();
  };

  return (
    <>
      <CardHeader
        classes={{root: style.headerRoot}}
        className={style.header}
        disableTypography
        avatar={
          <SocialAvatar
            name={post.user?.name ?? 'Unknown Myrian'}
            origin={post.platform}
            avatar={
              post.platform === 'myriad'
                ? post.user?.profilePictureURL
                : post.people?.profilePictureURL
            }
            onClick={openContentProfileUrl}
          />
        }
        title={
          <Typography variant="h5" onClick={openContentProfileUrl} className={style.title}>
            {post.platform === 'myriad' ? post.user?.name : (post.people?.name as string)}
          </Typography>
        }
        subheader={
          <PostSubHeader
            postId={post.id}
            date={post.createdAt}
            importers={post.importers}
            platform={post.platform}
            url={post.url}
            totalImporters={post.totalImporter}
            onImporters={handleImporter}
            totalExperience={post.totalExperience}
            experiences={post?.experiences}
          />
        }
        action={
          !disableAction ? (
            <IconButton
              aria-label="post-setting"
              onClick={handleOpenPostSetting}
              className={style.action}
              disableRipple={true}
              disableFocusRipple={true}
              disableTouchRipple>
              <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" className={style.icon} />
            </IconButton>
          ) : null
        }
      />

      <Menu
        id="post-setting"
        anchorEl={anchorEl}
        style={{width: 170}}
        classes={{paper: style.menu}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClosePostSetting}>
        <BaseMenuItem onClick={handleOpenTipHistory}>
          {i18n.t('Post_Detail.Post_Options.Tip_History')}
        </BaseMenuItem>

        <ShowIf condition={!owner}>
          <BaseMenuItem onClick={openPost}>
            {i18n.t('Post_Detail.Post_Options.View_Post')}
          </BaseMenuItem>
        </ShowIf>

        <ShowIf condition={!owner && post.platform !== 'myriad'}>
          <BaseMenuItem onClick={openSourcePost}>
            {i18n.t('Post_Detail.Post_Options.View_Source_Post')}
          </BaseMenuItem>
          <BaseMenuItem onClick={openUserProfile}>
            {i18n.t('Post_Detail.Post_Options.Visit_Myriad_Profile')}
          </BaseMenuItem>
          <BaseMenuItem onClick={openSourceAccount}>
            {i18n.t('Post_Detail.Post_Options.Visit_Post_Platform', {
              postPlatform: capitalize(post.platform),
            })}
          </BaseMenuItem>
        </ShowIf>

        <ShowIf condition={!owner && post.platform === 'myriad'}>
          <BaseMenuItem onClick={openUserProfile}>
            {i18n.t('Post_Detail.Post_Options.Visit_Profile')}
          </BaseMenuItem>
        </ShowIf>

        <ShowIf condition={owner && !post.deletedAt}>
          <MenuItem onClick={handlePostVisibility} fallback={handleClosePostSetting}>
            {i18n.t('Post_Detail.Post_Options.Post_Visibility')}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={!!user}>
          <MenuItem onClick={handleOpenAddPostToExperience} fallback={handleClosePostSetting}>
            {i18n.t('Post_Detail.Post_Options.Add_Post_To_Experience')}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={!owner && !!user}>
          <MenuItem
            onClick={handleReport}
            fallback={handleClosePostSetting}
            className={style.danger}>
            {i18n.t('Post_Detail.Post_Options.Report')}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={owner && !post.deletedAt}>
          <MenuItem
            onClick={handleDelete}
            fallback={handleClosePostSetting}
            className={style.danger}
            color="danger">
            {i18n.t('Post_Detail.Post_Options.Delete_Post')}
          </MenuItem>
        </ShowIf>
      </Menu>
    </>
  );
};
