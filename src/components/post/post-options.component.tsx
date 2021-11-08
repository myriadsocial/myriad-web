import React from 'react';

import {Divider} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

import {usePostHook} from 'src/hooks/use-post.hook';

type PostOptionsProps = {
  ownPost: boolean;
  postId: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'block',
      position: 'relative',
    },
    menu: {},
    danger: {
      color: '#F83D3D',
      marginBottom: 0,
      '&:hover': {
        background: 'none',
      },
    },
  }),
);

type MenuOptions = {
  id: string;
  name: string;
  show: boolean;
  onClick: () => void;
};

export const PostOptionsComponent: React.FC<PostOptionsProps> = ({postId, ownPost}) => {
  const styles = useStyles();
  const {removePost} = usePostHook();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEditPost = () => {
    handleClose();
  };

  const handleCopyLink = () => {
    handleClose();
  };

  const handleVisitMyriadAccount = () => {
    handleClose();
  };

  const handleVisitSocialPost = () => {
    handleClose();
  };

  const handleDeletePost = () => {
    removePost(postId);
  };

  const handleReportPost = () => {
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuList: MenuOptions[] = [
    {
      id: 'edit-post',
      name: 'Edit post',
      show: ownPost,
      onClick: handleEditPost,
    },
    {
      id: 'copy-link',
      name: 'Copy link...',
      show: true,
      onClick: handleCopyLink,
    },
    {
      id: 'visit-myriad-account',
      name: 'Visit Myriad account',
      show: !ownPost,
      onClick: handleVisitMyriadAccount,
    },
    {
      id: 'visit-social-post',
      name: 'Visit social post',
      show: !ownPost,
      onClick: handleVisitSocialPost,
    },
  ];

  return (
    <div className={styles.root}>
      <IconButton
        aria-label="post-setting"
        onClick={handleClick}
        disableRipple={true}
        disableFocusRipple={true}
        disableTouchRipple>
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="post-options"
        aria-label="post-options"
        className={styles.menu}
        anchorEl={anchorEl}
        keepMounted
        open={open}
        TransitionComponent={Fade}
        onClose={handleClose}>
        {menuList.map(item => {
          return (
            <MenuItem aria-label={item.id} onClick={item.onClick} key={item.id}>
              {item.name}
            </MenuItem>
          );
        })}

        <Divider />

        {ownPost && (
          <MenuItem onClick={handleDeletePost}>
            <Button
              className={styles.danger}
              disableRipple={true}
              disableFocusRipple={true}
              variant="text"
              color="default"
              size="medium"
              startIcon={<DeleteIcon />}>
              Delete this Post
            </Button>
          </MenuItem>
        )}

        {!ownPost && (
          <MenuItem onClick={handleReportPost}>
            <Button
              className={styles.danger}
              disableRipple={true}
              disableFocusRipple={true}
              variant="text"
              color="default"
              size="medium"
              startIcon={<ReportProblemIcon />}>
              Report this post
            </Button>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};
