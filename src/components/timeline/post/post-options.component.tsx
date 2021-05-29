import React from 'react';

import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

type PostOptionsProps = {
  ownPost: boolean;
  postId: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      position: 'relative'
    },
    menu: {},
    danger: {
      color: '#F83D3D',
      marginBottom: 0
    }
  })
);

export const PostOptionsComponent: React.FC<PostOptionsProps> = ({ postId, ownPost }) => {
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.root}>
      <IconButton aria-label="post-setting" onClick={handleClick} disableRipple={true}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="post-options"
        className={styles.menu}
        anchorEl={anchorEl}
        keepMounted
        open={open}
        TransitionComponent={Fade}
        onClose={handleClose}>
        {ownPost ? (
          <MenuItem onClick={handleClick}>Edit post</MenuItem>
        ) : (
          <>
            <MenuItem onClick={handleClick}>Visit account</MenuItem>
            <MenuItem onClick={handleClick}>Visit social post</MenuItem>
            <MenuItem onClick={handleClick}>Mute post from this person</MenuItem>
          </>
        )}

        <MenuItem onClick={handleClick}>Save post to archive</MenuItem>
        <MenuItem onClick={handleClick}>Share...</MenuItem>
        <Divider />
        {ownPost ? (
          <MenuItem onClick={handleClick}>
            <Button
              className={styles.danger}
              onClick={handleClick}
              disableRipple={true}
              disableFocusRipple={true}
              variant="text"
              color="default"
              size="large"
              startIcon={<DeleteIcon />}>
              Delete this Post
            </Button>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleClick}>
            <Button
              className={styles.danger}
              onClick={handleClick}
              disableRipple={true}
              disableFocusRipple={true}
              variant="text"
              color="default"
              size="large"
              startIcon={<ReportProblemIcon />}>
              Report this post
            </Button>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};
