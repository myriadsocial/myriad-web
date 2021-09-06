import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {debounce} from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '200px',
      borderRadius: '10px',
    },
    header: {
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '6px 16px',
    },
    tokenColumn: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    avatar: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      marginRight: theme.spacing(1),
    },
    text: {
      fontWeight: 400,
      fontSize: '12px',
    },
    input: {
      width: '160px',
      height: '32px',
      border: 'solid grey 1px',
      borderRadius: '20px',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  }),
);

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

// TODO CHANGE TEMP DATA
const Currencies = [
  {key: 1, tokenSymbol: 'aUSD', tokenImage: 'A', balance: '$452.02'},
  {key: 2, tokenSymbol: 'ACA', tokenImage: 'A', balance: '$452.02'},
  {key: 3, tokenSymbol: 'Myria', tokenImage: 'M', balance: '$452.02'},
  {key: 4, tokenSymbol: 'ETH', tokenImage: 'E', balance: '$452.02'},
  {key: 5, tokenSymbol: 'BTC', tokenImage: 'B', balance: '$452.02'},
];

export const CurrencyOptionComponent: React.FC<Props> = () => {
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
        {Currencies.map(item => (
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
