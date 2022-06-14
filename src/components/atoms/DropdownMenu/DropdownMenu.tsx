import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {Grid, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';

import ShowIf from '../../common/show-if.component';
import {useStyles} from './DropdownMenu.styles';
import {MenuOptions} from './DropdownMenu.types';

type DropdownMenuProps<T> = {
  title: string;
  options: MenuOptions<T>[];
  selected?: T;
  disabled?: boolean;
  useIconOnMobile?: boolean;
  onChange: (selected: T) => void;
};

export const DropdownMenu = <T,>(props: DropdownMenuProps<T>): JSX.Element => {
  const {title, options, onChange, disabled = false, useIconOnMobile = true, selected} = props;
  const styles = useStyles({useIconOnMobile});

  const [current, setCurrent] = useState<T>(selected);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelected = (option: T) => {
    setCurrent(option);
    onChange(option);
    handleClose();
  };

  const getSelectedText = (): string => {
    const match = options.find(option => option.id === current);
    if (match) {
      return match?.title;
    } else {
      return options[0].title;
    }
  };

  return (
    <div className={styles.root}>
      <Grid container justifyContent="space-between" className={styles.content}>
        <div>
          <Typography component="span" color="textSecondary" className={styles.title}>
            <ShowIf condition={title.length > 0}>{title}:&nbsp;</ShowIf>
          </Typography>

          <Typography
            component="span"
            color={disabled ? 'textSecondary' : 'textPrimary'}
            className={styles.selected}>
            {getSelectedText()}
          </Typography>
        </div>
        <IconButton
          onClick={handleClick}
          color="primary"
          aria-label="expand"
          className={styles.expand}
          disabled={disabled}>
          <SvgIcon
            component={ChevronDownIcon}
            fontSize="small"
            color={disabled ? 'inherit' : 'primary'}
          />
        </IconButton>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {options.map(option => (
          <MenuItem key={option.title} onClick={() => handleSelected(option.id)}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
