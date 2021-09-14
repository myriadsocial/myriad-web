import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// TODO move icon to HEROICONS
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export const SortComponent: React.FC<Props> = () => {
  const [sort, setSort] = useState('Latest');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (keyword: string) => {
    setSort(keyword);
    handleClose();
  };

  return (
    <div>
      <Typography component="span">
        <Typography component="span" color="textSecondary">
          Sort by:
        </Typography>{' '}
        {sort}
      </Typography>

      <IconButton onClick={handleClick} color="primary" aria-label="expand">
        <ExpandMoreIcon />
      </IconButton>
      <Menu
        id="friend-response-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'center', horizontal: 'right'}}
        transformOrigin={{vertical: 'center', horizontal: 'left'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={() => handleSort('Latest')}>Latest</MenuItem>
        <MenuItem onClick={() => handleSort('Popular')}>Popular</MenuItem>
        <MenuItem onClick={() => handleSort('Most like')}>Most like</MenuItem>
        <MenuItem onClick={() => handleSort('Most commented')}>Most commented</MenuItem>
      </Menu>
    </div>
  );
};
