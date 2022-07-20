import {DotsVerticalIcon} from '@heroicons/react/solid';

import React, {useCallback} from 'react';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {capitalize, Menu, Typography} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import ExternalLink from '@material-ui/core/Link';
import BaseMenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';

import {PostSubHeader} from '../SubHeader';
import {PostHeaderProps} from './Header.interface';
import {useStyles} from './Header.style';

import useTipHistory from 'components/TipHistory/use-tip-history.hook';
import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import useModalAddToPost from 'src/components/Expericence/ModalAddToPost/useModalAddToPost.hook';
import {SocialAvatar} from 'src/components/atoms/SocialAvatar';
import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';

const MenuItem = WithAuthorizeAction(BaseMenuItem);

export const PostHeader: React.FC<PostHeaderProps> = props => {
  const {user, post, owned} = props;
  const {onDelete, onChangeVisibility, onReport, onShowImporters} = props;

  const style = useStyles();
  const router = useRouter();
  const tipHistory = useTipHistory();
  const addPostToExperience = useModalAddToPost();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenPostSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePostSetting = () => {
    setAnchorEl(null);
  };

  const openContentProfileUrl = useCallback((): void => {
    const url = getPlatformProfileUrl();

    switch (post.platform) {
      case 'myriad':
        router.push(url);
        break;
      default:
        window.open(url, '_blank');
        break;
    }
  }, []);

  const getPlatformProfileUrl = (): string => {
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
    handleClosePostSetting();

    onDelete();
  };

  const handlePostVisibility = () => {
    handleClosePostSetting();

    onChangeVisibility();
  };

  const handleReport = () => {
    handleClosePostSetting();

    onReport();
  };

  const handleShowImporter = useCallback(() => {
    handleClosePostSetting();

    onShowImporters();
  }, []);

  const handleOpenTipHistory = () => {
    handleClosePostSetting();

    tipHistory.open(post);
  };

  const handleOpenAddPostToExperience = () => {
    handleClosePostSetting();
    const propsAddToPost = {
      post: post,
    };
    addPostToExperience(propsAddToPost);
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
            onShowImporters={handleShowImporter}
            totalExperience={post.totalExperience}
            experiences={post.experiences}
          />
        }
        action={
          <IconButton
            aria-label="post-setting"
            onClick={handleOpenPostSetting}
            className={style.action}
            disableRipple={true}
            disableFocusRipple={true}
            disableTouchRipple>
            <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" className={style.icon} />
          </IconButton>
        }
      />

      {anchorEl && (
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

          <ShowIf condition={!owned}>
            <BaseMenuItem className={style.link}>
              <Link href={`/post/${post.id}`} passHref prefetch={false}>
                {i18n.t('Post_Detail.Post_Options.View_Post')}
              </Link>
            </BaseMenuItem>
          </ShowIf>

          <ShowIf condition={!owned && post.platform !== 'myriad'}>
            <BaseMenuItem>
              <ExternalLink href={post.url} target="_blank" color="inherit" underline="none">
                {i18n.t('Post_Detail.Post_Options.View_Source_Post')}
              </ExternalLink>
            </BaseMenuItem>
            <BaseMenuItem className={style.link}>
              <Link href={`profile/${post.user.id}`} passHref prefetch={false}>
                {i18n.t('Post_Detail.Post_Options.Visit_Myriad_Profile')}
              </Link>
            </BaseMenuItem>
            <BaseMenuItem>
              <ExternalLink
                href={getPlatformProfileUrl()}
                target="_blank"
                color="inherit"
                underline="none">
                {i18n.t('Post_Detail.Post_Options.Visit_Post_Platform', {
                  postPlatform: capitalize(post.platform),
                })}
              </ExternalLink>
            </BaseMenuItem>
          </ShowIf>

          <ShowIf condition={!owned && post.platform === 'myriad'}>
            <BaseMenuItem className={style.link}>
              <Link href={`/profile/${post.user.id}`} passHref prefetch={false}>
                {i18n.t('Post_Detail.Post_Options.Visit_Profile')}
              </Link>
            </BaseMenuItem>
          </ShowIf>

          <ShowIf condition={owned && !post.deletedAt}>
            <MenuItem onClick={handlePostVisibility} fallback={handleClosePostSetting}>
              {i18n.t('Post_Detail.Post_Options.Post_Visibility')}
            </MenuItem>
          </ShowIf>

          <ShowIf condition={!!user}>
            <MenuItem onClick={handleOpenAddPostToExperience} fallback={handleClosePostSetting}>
              {i18n.t('Post_Detail.Post_Options.Add_Post_To_Experience')}
            </MenuItem>
          </ShowIf>

          <ShowIf condition={!owned && !!user}>
            <MenuItem
              onClick={handleReport}
              fallback={handleClosePostSetting}
              className={style.danger}>
              {i18n.t('Post_Detail.Post_Options.Report')}
            </MenuItem>
          </ShowIf>

          <ShowIf condition={owned && !post.deletedAt}>
            <MenuItem
              onClick={handleDelete}
              fallback={handleClosePostSetting}
              className={style.danger}
              color="danger">
              {i18n.t('Post_Detail.Post_Options.Delete_Post')}
            </MenuItem>
          </ShowIf>
        </Menu>
      )}
    </>
  );
};
