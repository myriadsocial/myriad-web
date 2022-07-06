import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';

import {useRouter} from 'next/router';

import {Menu, MenuItem, Typography} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

import {useStyles} from '../PostHeader/postHeader.style';

import {PostSubHeader} from 'components/PostHeader/subHeader/post-sub-header.component';
import {SocialAvatar} from 'components/atoms/SocialAvatar';
import {Post} from 'src/interfaces/post';
import {SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';

export type PostHeaderExperienceProps = {
  post: Post;
  onImporters: () => void;
  onRemoveFromExperience?: () => void;
  disableAction?: boolean;
};

export const HeaderComponentExperience: React.FC<PostHeaderExperienceProps> = props => {
  const {post, disableAction = false, onRemoveFromExperience, onImporters} = props;

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

  const handleImporter = () => {
    onImporters();
  };

  const handleRemoveFromExperience = () => {
    onRemoveFromExperience && onRemoveFromExperience();
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
        <MenuItem onClick={handleRemoveFromExperience}>
          {i18n.t('Experience.Editor.Menu_Post.Remove')}
        </MenuItem>
      </Menu>
    </>
  );
};
