import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';

import {useRouter} from 'next/router';

import {capitalize, Menu, MenuItem, Typography} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

import PostAvatarComponent from './avatar/post-avatar.component';
import {PostHeaderProps} from './postHeader.interface';
import {useStyles} from './postHeader.style';
import {PostSubHeader} from './subHeader/post-sub-header.component';

import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces/social';

export const HeaderComponent: React.FC<PostHeaderProps> = props => {
  const {
    post,
    owner,
    disableAction = false,
    onDelete,
    onOpenTipHistory,
    onReport,
    onVisibility,
  } = props;

  const style = useStyles();
  const router = useRouter();

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

  const handleOpenTipHistory = () => {
    onOpenTipHistory();
    handleClosePostSetting();
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
        className={style.header}
        disableTypography
        avatar={
          <PostAvatarComponent
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
          <Typography variant="h5">
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
              <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" />
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
        <MenuItem onClick={handleOpenTipHistory}>Tip History</MenuItem>

        <ShowIf condition={!owner}>
          <MenuItem onClick={openPost}>View Post</MenuItem>
        </ShowIf>

        <ShowIf condition={!owner && post.platform !== 'myriad'}>
          <MenuItem onClick={openSourcePost}>View Source Post</MenuItem>
          <MenuItem onClick={openUserProfile}>Visit Myriad Profile</MenuItem>
          <MenuItem onClick={openSourceAccount}>Visit {capitalize(post.platform)} Account</MenuItem>
        </ShowIf>

        <ShowIf condition={!owner && post.platform === 'myriad'}>
          <MenuItem onClick={openUserProfile}>Visit Profile</MenuItem>
        </ShowIf>

        <ShowIf condition={!owner}>
          <MenuItem onClick={handleReport} className={style.danger}>
            Report
          </MenuItem>
        </ShowIf>

        <ShowIf condition={owner && !post.deletedAt}>
          <MenuItem onClick={handlePostVisibility}>Post Visibility</MenuItem>
        </ShowIf>

        <ShowIf condition={owner && !post.deletedAt}>
          <MenuItem onClick={handleDelete} className={style.danger} color="danger">
            Delete Post
          </MenuItem>
        </ShowIf>
      </Menu>
    </>
  );
};
