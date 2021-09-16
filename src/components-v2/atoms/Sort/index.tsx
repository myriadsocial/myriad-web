import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import {makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  action: {
    '& .MuiSvgIcon-root': {
      fill: 'none',
    },
  },
}));

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export const SortComponent: React.FC<Props> = () => {
  const classes = useStyles();
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

      <IconButton
        disableRipple
        className={classes.action}
        onClick={handleClick}
        color="primary"
        aria-label="expand">
        <SvgIcon component={ChevronDownIcon} viewBox="0 0 24 24" />
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
