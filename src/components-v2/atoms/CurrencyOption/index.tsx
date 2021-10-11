import {ChevronDownIcon} from '@heroicons/react/solid';
import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {BalanceDetail} from '../../../interfaces/balance';
import {useStyles} from './currencyOption.style';

import {debounce} from 'lodash';

type Props = {
  balanceDetails: BalanceDetail[];
  onSelect: (selected: BalanceDetail) => void;
};

export const CurrencyOptionComponent: React.FC<Props> = props => {
  const {balanceDetails, onSelect} = props;
  const [search, setSearch] = useState('');
  const style = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selected: BalanceDetail) => {
    onSelect(selected);
    handleClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO FILTER WHEN TYPING
    setSearch(event.target.value);
    const debounceSubmit = debounce(() => {
      console.log(search);
    }, 300);

    debounceSubmit();
  };

  const submitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // TODO FILTER WHEN ENTER
    if (event.key === 'Enter') {
      console.log(search);
    }
  };

  if (!balanceDetails) return null;

  return (
    <div>
      <Typography component="span">Change currency</Typography>

      <IconButton style={{padding: 0}} onClick={handleClick} color="primary" aria-label="expand">
        <SvgIcon classes={{root: style.fill}} component={ChevronDownIcon} viewBox="0 0 20 20" />
      </IconButton>
      <Menu
        classes={{
          paper: style.root,
        }}
        id="friend-response-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <div className={style.flex}>
          <InputBase
            className={style.input}
            onKeyUp={submitSearch}
            value={search}
            onChange={handleChange}
            placeholder={`Search Coin`}
            inputProps={{
              'aria-label': 'search',
            }}
            startAdornment={
              <SvgIcon classes={{root: style.fill}} component={SearchIcon} viewBox="0 0 24 24" />
            }
          />
        </div>
        <div className={style.header}>
          <Typography component="span">Coin</Typography>
          <Typography component="span">Balance</Typography>
        </div>
        {balanceDetails &&
          balanceDetails.map(item => (
            <MenuItem
              classes={{root: style.hover}}
              key={item.id}
              onClick={() => handleSelect(item)}>
              <div className={style.flex}>
                <div className={style.tokenColumn}>
                  <Avatar
                    className={`${style.avatar} ${style.text}`}
                    alt={item.id}
                    src={item.image}>
                    {item.id}
                  </Avatar>
                  <Typography color="textSecondary">{item.id}</Typography>
                </div>
                <Typography component="span">{item.freeBalance}</Typography>
              </div>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};
