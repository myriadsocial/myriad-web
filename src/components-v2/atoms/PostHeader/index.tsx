import {DotsVerticalIcon} from '@heroicons/react/solid';
import {action} from '@storybook/addon-actions';

import React from 'react';

import {useRouter} from 'next/router';

import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import {Post} from '../../../interfaces/post';
import CardTitle from './CardTitle.component';
import PostAvatarComponent from './post-avatar.component';
import {PostSubHeader} from './post-sub-header.component';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    action: {
      display: 'block',
      position: 'relative',
      top: 10,
    },
    header: {
      position: 'relative',
      background: '#FFF',

      '& .MuiCardHeader-title': {
        fontSize: 18,
        lineHeight: '24px',
        fontWeight: 'bold',
      },
    },
  }),
);

type PostComponentProps = {
  disable?: boolean;
  post: Post;
};

export const HeaderComponent: React.FC<PostComponentProps> = ({post}) => {
  const style = useStyles();
  const router = useRouter();

  const openContentSource = (): void => {
    const url = getPlatformUrl();

    switch (post.platform) {
      case 'myriad':
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
      case 'twitter':
        url = `https://twitter.com/${post.people?.username as string}`;
        break;
      case 'reddit':
        url = `https://reddit.com/user/${post.people?.username as string}`;
        break;
      case 'myriad':
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
            post.platform === 'myriad'
              ? post.user?.profilePictureURL
              : post.people?.profilePictureURL
          }
          onClick={openContentSource}
        />
      }
      title={
        <CardTitle
          text={post.platform === 'myriad' ? post.user?.name : (post.people?.name as string)}
          url={getPlatformUrl()}
        />
      }
      subheader={
        <PostSubHeader
          date={post.createdAt}
          importer={post.platform !== 'myriad' ? post.user : undefined}
          platform={post.platform}
        />
      }
      action={
        <IconButton
          aria-label="post-setting"
          onClick={action('open-menu-option')}
          className={style.action}
          disableRipple={true}
          disableFocusRipple={true}
          disableTouchRipple>
          <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" />
        </IconButton>
      }
    />
  );
};
