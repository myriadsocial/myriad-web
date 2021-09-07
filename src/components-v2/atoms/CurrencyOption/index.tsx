import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {Props} from './currencyOption.interface';
import {useStyles} from './currencyOption.style';

import {debounce} from 'lodash';

export const CurrencyOptionComponent: React.FC<Props> = props => {
  const {currencies} = props;
  const [search, setSearch] = useState('');
  const style = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selected: string) => {
    // TODO ACTION WHEN CLICK OPTIONS
    console.log(selected);
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

  return (
    <div>
      <Typography component="span">Change currency</Typography>

      <IconButton style={{padding: 0}} onClick={handleClick} color="primary" aria-label="expand">
        <ExpandMoreIcon />
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
            startAdornment={<SvgIcon component={SearchIcon} viewBox="0 0 24 24" />}
          />
        </div>
        <div className={style.header}>
          <Typography component="span">Coin</Typography>
          <Typography component="span">Balance</Typography>
        </div>
        {currencies &&
          currencies.map(item => (
            <MenuItem key={item.key} onClick={() => handleSelect(item.tokenSymbol)}>
              <div className={style.flex}>
                <div className={style.tokenColumn}>
                  <Avatar className={`${style.avatar} ${style.text}`} alt={'aUSD'} src={''}>
                    {item.tokenImage}
                  </Avatar>
                  <Typography color="textSecondary">{item.tokenSymbol}</Typography>
                </div>
                <Typography component="span">{item.balance}</Typography>
              </div>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};
