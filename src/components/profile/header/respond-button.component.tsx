import React from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {useStyles} from './header.style';

type Props = {
  handleReject: () => void;
  handleApprove: () => void;
};

const RespondFriendButton: React.FC<Props> = ({handleReject, handleApprove}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const style = useStyles();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRejectFriend = () => {
    handleReject();
    handleClose();
  };

  const handleApproveFriend = () => {
    handleApprove();
    handleClose();
  };

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        className={style.button2}
        aria-controls="friend-response-menu"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
        Respond Friend
      </Button>
      <Menu
        style={{marginTop: 8}}
        id="friend-response-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={handleApproveFriend}>Accept friend request</MenuItem>
        <div />
        <MenuItem onClick={handleRejectFriend}>Ignore</MenuItem>
      </Menu>
    </div>
  );
};

export default RespondFriendButton;
