import React from 'react';

import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

type PostOptionsProps = {
  ownPost: boolean;
  postId: string;
};

const useStyles = makeStyles((theme: Theme) =>
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

export const LayoutOptionsComponent: React.FC<PostOptionsProps> = ({postId, ownPost}) => {
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
        className={styles.menu}
        anchorEl={anchorEl}
        keepMounted
        open={open}
        TransitionComponent={Fade}
        onClose={handleClose}>
        <MenuItem onClick={handleClick}>Edit post</MenuItem>

        <MenuItem onClick={handleClick}>Save post to archive</MenuItem>
        <MenuItem onClick={handleClick}>Share...</MenuItem>
      </Menu>
    </div>
  );
};
