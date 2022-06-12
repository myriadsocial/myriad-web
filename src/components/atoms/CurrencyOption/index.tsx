import {ChevronDownIcon} from '@heroicons/react/solid';
import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {BalanceDetail} from '../../../interfaces/balance';
import {Avatar, AvatarSize} from '../Avatar';
import {CurrencyOptionProps} from './currencyOption.interface';
import {useStyles} from './currencyOption.style';

import {debounce} from 'lodash';
import {CurrencyId} from 'src/interfaces/currency';
import i18n from 'src/locale';

export const CurrencyOptionComponent: React.FC<CurrencyOptionProps> = props => {
  const {balanceDetails, onSelect, isOtherTippingCurrencyDisabled} = props;
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
      // code
    }, 300);

    debounceSubmit();
  };

  const submitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // TODO FILTER WHEN ENTER
    if (event.key === 'Enter') {
      // code
    }
  };

  if (!balanceDetails) return null;

  return (
    <div>
      <IconButton style={{padding: 0}} onClick={handleClick} color="primary" aria-label="expand">
        <Typography component="span" color="textPrimary">
          {i18n.t('Tipping.Modal_Main.Currency_Options')}
        </Typography>
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
            placeholder={i18n.t('Tipping.Modal_Main.Search_Coin')}
            inputProps={{
              'aria-label': 'search',
            }}
            startAdornment={
              <SvgIcon classes={{root: style.fill}} component={SearchIcon} viewBox="0 0 24 24" />
            }
          />
        </div>
        <div className={style.header}>
          <Typography component="span">{i18n.t('Tipping.Modal_Main.Coin')}</Typography>
          <Typography component="span">{i18n.t('Tipping.Modal_Main.Balance')}</Typography>
        </div>
        {balanceDetails &&
          balanceDetails.map(item => (
            <MenuItem
              classes={{root: style.hover}}
              key={item.id}
              disabled={isOtherTippingCurrencyDisabled && item.symbol !== CurrencyId.MYRIA}
              onClick={() => handleSelect(item)}>
              <div className={style.flex}>
                <div className={style.tokenColumn}>
                  <Avatar
                    name={item.id}
                    className={style.text}
                    alt={item.id}
                    src={item.image}
                    size={AvatarSize.TINY}
                  />
                  <Typography color="textSecondary">{item.symbol}</Typography>
                </div>
                <Typography component="span">{parseFloat(item.freeBalance.toFixed(4))}</Typography>
              </div>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};
