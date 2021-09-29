import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';

import {useStyles} from './DropdownMenu.styles';
import {MenuOptions} from './DropdownMenu.types';

type DropdownMenuProps = {
  title: string;
  options: MenuOptions<string>[];
  selected?: string;
  onChange: (selected: string) => void;
};

export const DropdownMenu: React.FC<DropdownMenuProps> = props => {
  const {title, options, onChange} = props;
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
    onChange(option);
    handleClose();
  };

  const getSelectedText = (): string => {
    const match = options.find(option => option.id === selected);

    return match?.title ?? '';
  };

  return (
    <div className={styles.root}>
      <div>
        <Typography component="span" color="textSecondary">
          {title}:&nbsp;
        </Typography>

        <Typography component="span" color="textPrimary" className={styles.selected}>
          {getSelectedText()}
        </Typography>
      </div>

      <IconButton
        onClick={handleClick}
        color="primary"
        aria-label="expand"
        className={styles.expand}>
        <SvgIcon component={ChevronDownIcon} fontSize="small" color="primary" />
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
