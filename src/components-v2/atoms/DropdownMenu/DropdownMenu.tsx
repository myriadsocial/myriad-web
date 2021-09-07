import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {useStyles} from './DropdownMenu.styles';
import {MenuOptions} from './DropdownMenu.types';

type DropdownMenuProps = {
  title: string;
  options: MenuOptions[];
  selected?: string;
};

export const DropdownMenu: React.FC<DropdownMenuProps> = props => {
  const {title, options} = props;
  const styles = useStyles();

  const [selected, setSelected] = useState<string>(options[0].id);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelected = (option: string) => {
    setSelected(option);
    handleClose();
  };

  return (
    <div className={styles.root}>
      <Typography component="span">
        <Typography component="span" color="textSecondary">
          {title}:
        </Typography>{' '}
        {selected}
      </Typography>

      <IconButton onClick={handleClick} color="primary" aria-label="expand">
        <ExpandMoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'center', horizontal: 'right'}}
        transformOrigin={{vertical: 'center', horizontal: 'left'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {options.map(option => (
          <MenuItem key={option.id} onClick={() => handleSelected(option.id)}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
