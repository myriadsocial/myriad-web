import {CheckCircleIcon} from '@heroicons/react/solid';
import {SearchIcon} from '@heroicons/react/solid';

import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../Avatar';
import {Modal} from '../Modal';
import {useStyles} from './AddCoin.style';
import {Props} from './addCoin.interface';

import {debounce} from 'lodash';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {addUserCurrency} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const AddCoin: React.FC<Props> = props => {
  const {open, onClose} = props;
  const dispatch = useDispatch();
  const {availableCurrencies} = useSelector<RootState, ConfigState>(state => state.configState);
  const {currencies} = useSelector<RootState, UserState>(state => state.userState);
  const style = useStyles();

  const [searchedCurrencies, setSearchedCurrencies] = useState<Currency[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [myAsset, setMyAsset] = useState<CurrencyId[]>([]);

  useEffect(() => {
    setSearchedCurrencies(availableCurrencies);
    setMyAsset(assetId());
  }, [currencies]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO FILTER WHEN TYPING
    setSearch(event.target.value);
    const debounceSubmit = debounce(() => {
      // code
    }, 300);

    debounceSubmit();
  };

  const assetId = () => {
    return currencies.map(currency => currency.symbol);
  };

  const submitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // TODO FILTER WHEN ENTER
    if (event.key === 'Enter') {
      const searchResults = availableCurrencies.filter(currencies =>
        currencies.id.toLowerCase().includes(search),
      );
      setSearchedCurrencies(searchResults);
    }
  };

  const handleSelectAsset = (currency: CurrencyId) => {
    if (currency === selectedAsset || isAdded(currency)) setSelectedAsset(null);
    else setSelectedAsset(currency);
  };

  const isSelected = (code: string) => {
    if (selectedAsset === code) return style.selected;
    else return;
  };

  const filterSelectedCurrency = () => {
    const result = availableCurrencies.filter(el => {
      return el.id === selectedAsset;
    });

    return result[0];
  };

  const handleAddNewCurrency = () => {
    if (selectedAsset) {
      setLoading(true);
      dispatch(addUserCurrency(filterSelectedCurrency()));
    }

    onClose();
    setLoading(false);
    setSelectedAsset(null);
  };

  const LoadingComponent = () => {
    return (
      <Grid container justifyContent="center">
        <CircularProgress />
      </Grid>
    );
  };

  const isAdded = (selectedId: CurrencyId) => {
    return myAsset.includes(selectedId);
  };

  return (
    <Modal title="Add coin" onClose={onClose} open={open}>
      <div className={style.root}>
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

        <List>
          {loading && <LoadingComponent />}
          {!loading &&
            searchedCurrencies.map(currency => (
              <ListItem
                disabled={isAdded(currency.symbol)}
                key={currency.id}
                onClick={() => handleSelectAsset(currency.symbol)}
                className={`${!isAdded(currency.symbol) && style.hover} ${style.item} ${isSelected(
                  'ACA',
                )}`}
                alignItems="center">
                <ListItemAvatar>
                  <Avatar
                    name="A"
                    alt={currency.symbol}
                    src={currency.image}
                    size={AvatarSize.MEDIUM}
                  />
                </ListItemAvatar>
                <ListItemText>
                  <Typography
                    variant="h5"
                    className={style.header}
                    component="span"
                    color="textPrimary">
                    {currency.symbol}
                  </Typography>
                  <Typography
                    variant="caption"
                    className={style.subHeader}
                    component="p"
                    color="textSecondary">
                    {currency.symbol} Token
                  </Typography>
                </ListItemText>
                {selectedAsset === currency.symbol && (
                  <ListItemSecondaryAction>
                    <SvgIcon
                      color="primary"
                      classes={{root: style.fill}}
                      component={CheckCircleIcon}
                      viewBox="0 0 20 20"
                    />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
        </List>
        <Button
          disabled={selectedAsset === null}
          onClick={handleAddNewCurrency}
          className={style.button}
          fullWidth
          variant="contained"
          color="primary">
          Add to my wallet
        </Button>
      </div>
    </Modal>
  );
};
