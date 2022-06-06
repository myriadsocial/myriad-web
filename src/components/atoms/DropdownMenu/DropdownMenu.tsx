import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';

import {Grid, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';

import ShowIf from '../../common/show-if.component';
import {useStyles} from './DropdownMenu.styles';
import {MenuOptions} from './DropdownMenu.types';

import {SortIcon} from 'src/components/atoms/Icons';

type DropdownMenuProps<T> = {
  title: string;
  options: MenuOptions<T>[];
  selected?: T;
  disabled?: boolean;
  useIconOnMobile?: boolean;
  onChange: (selected: T) => void;
};

export const DropdownMenu = <T,>(props: DropdownMenuProps<T>): JSX.Element => {
  const {title, options, selected, onChange, disabled = false, useIconOnMobile = true} = props;
  const styles = useStyles({useIconOnMobile});

  const [current, setCurrent] = useState<T>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (options.length) {
      setCurrent(options[0].id);
    }

    if (selected) {
      setCurrent(selected);
    }
  }, [options, selected]);

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
    return match?.title ?? '';
  };

  return (
    <div className={styles.root}>
      <Grid container justifyContent="space-between" className={styles.content}>
        <div>
          <Typography component="span" color="textSecondary">
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
      <IconButton onClick={handleClick} color="primary" aria-label="expand" className={styles.sort}>
        <SortIcon />
      </IconButton>

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
