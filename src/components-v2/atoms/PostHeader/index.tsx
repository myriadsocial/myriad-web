import {DotsVerticalIcon} from '@heroicons/react/solid';
import {action} from '@storybook/addon-actions';

import React from 'react';

import {useRouter} from 'next/router';

import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

import PostAvatarComponent from './avatar/post-avatar.component';
import CardTitle from './cardTitle/CardTitle.component';
import {PostComponentProps, Platform} from './postHeader.interface';
import {useStyles} from './postHeader.style';
import {PostSubHeader} from './subHeader/post-sub-header.component';

export const HeaderComponent: React.FC<PostComponentProps> = ({post, disable}) => {
  const style = useStyles();
  const router = useRouter();

  const openContentSource = (): void => {
    const url = getPlatformUrl();

    switch (post.platform) {
      case Platform.myriad:
        router.push(post.user?.id);
        break;
      default:
        window.open(url, '_blank');
        break;
    }
  };

  const getPlatformUrl = (): string => {
    let url = '';

    if (!post.user) return url;

    switch (post.platform) {
      case Platform.twitter:
        url = `https://twitter.com/${post.people?.username as string}`;
        break;
      case Platform.reddit:
        url = `https://reddit.com/user/${post.people?.username as string}`;
        break;
      case Platform.myriad:
        url = post.createdBy;
        break;
      default:
        url = post.url;
        break;
    }

    return url;
  };

  return (
    <CardHeader
      className={style.header}
      disableTypography
      avatar={
        <PostAvatarComponent
          origin={post.platform}
          avatar={
            post.platform === Platform.myriad
              ? post.user?.profilePictureURL
              : post.people?.profilePictureURL
          }
          onClick={openContentSource}
        />
      }
      title={
        <CardTitle
          text={post.platform === Platform.myriad ? post.user?.name : (post.people?.name as string)}
          url={getPlatformUrl()}
        />
      }
      subheader={
        <PostSubHeader
          date={post.createdAt}
          importer={post.platform !== Platform.myriad ? post.user : undefined}
          platform={post.platform}
        />
      }
      action={
        !disable && (
          <IconButton
            aria-label="post-setting"
            onClick={action('open-menu-option')}
            className={style.action}
            disableRipple={true}
            disableFocusRipple={true}
            disableTouchRipple>
            <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" />
          </IconButton>
        )
      }
    />
  );
};
