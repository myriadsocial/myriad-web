import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';

import {useRouter} from 'next/router';

import {Menu, MenuItem} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

import PostAvatarComponent from './avatar/post-avatar.component';
import CardTitle from './cardTitle/CardTitle.component';
import {PostHeaderProps, Platform} from './postHeader.interface';
import {useStyles} from './postHeader.style';
import {PostSubHeader} from './subHeader/post-sub-header.component';

import ShowIf from 'src/components/common/show-if.component';

export const HeaderComponent: React.FC<PostHeaderProps> = props => {
  const {post, owner, tipped = false, onDelete, onOpenTipHistory, onReport, onShared} = props;

  const style = useStyles();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenPostSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePostSetting = () => {
    setAnchorEl(null);
  };

  const openContentSource = (): void => {
    const url = getPlatformUrl();

    switch (post.platform) {
      case Platform.myriad:
        router.push(`/profile/${post.user?.id}`);
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
        url = `profile/${post.createdBy}`;
        break;
      default:
        url = post.url;
        break;
    }

    return url;
  };

  const handleShare = () => {
    onShared();
    handleClosePostSetting();
  };

  const handleDelete = () => {
    onDelete();
    handleClosePostSetting();
  };

  const handleReport = () => {
    onReport();
    handleClosePostSetting();
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory();
    handleClosePostSetting();
  };

  return (
    <>
      <CardHeader
        className={style.header}
        disableTypography
        avatar={
          <PostAvatarComponent
            name={post.user.name}
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
            text={
              post.platform === Platform.myriad ? post.user?.name : (post.people?.name as string)
            }
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
          <IconButton
            aria-label="post-setting"
            onClick={handleOpenPostSetting}
            className={style.action}
            disableRipple={true}
            disableFocusRipple={true}
            disableTouchRipple>
            <SvgIcon component={DotsVerticalIcon} />
          </IconButton>
        }
      />

      <Menu
        id="post-setting"
        anchorEl={anchorEl}
        style={{width: 170}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClosePostSetting}>
        <ShowIf condition={owner || tipped}>
          <MenuItem onClick={handleOpenTipHistory}>Tip History</MenuItem>
        </ShowIf>

        <MenuItem onClick={handleShare}>Share</MenuItem>

        <ShowIf condition={!owner}>
          <MenuItem onClick={handleReport} className={style.danger}>
            Report
          </MenuItem>
        </ShowIf>
        <ShowIf condition={owner}>
          <MenuItem onClick={handleDelete} className={style.danger} color="danger">
            Delete
          </MenuItem>
        </ShowIf>
      </Menu>
    </>
  );
};
