import {CheckCircleIcon} from '@heroicons/react/solid';
import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {acronym} from '../../../helpers/string';
import {RootState} from '../../../reducers/';
import {ConfigState} from '../../../reducers/config/reducer';
import {addUserCurrency} from '../../../reducers/user/actions';
import {Modal} from '../Modal';
import {useStyles} from './AddCoin.style';
import {Props} from './addCoin.interface';

import {debounce} from 'lodash';

export const AddCoin: React.FC<Props> = props => {
  const {open, onClose} = props;
  const dispatch = useDispatch();
  const {availableCurrencies} = useSelector<RootState, ConfigState>(state => state.configState);
  const style = useStyles();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

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

  const handleSelectAsset = (currency: string) => {
    if (currency === selectedAsset) setSelectedAsset(null);
    else setSelectedAsset(currency);
  };

  const handleAddCustomAsset = () => {
    // code
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
      dispatch(
        addUserCurrency(filterSelectedCurrency(), () => {
          setLoading(true);
        }),
      );
    }

    onClose();
    setLoading(false);
  };

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress />
      </Grid>
    );
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
          <ListItem onClick={handleAddCustomAsset} className={style.item} alignItems="center">
            <ListItemAvatar>
              <Avatar className={style.avatar} alt={'name'} src={''}></Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Typography className={style.header} component="span" color="textPrimary">
                Custom asset
              </Typography>
              <Typography className={style.subHeader} component="p" color="textSecondary">
                Add custom asset
              </Typography>
            </ListItemText>
          </ListItem>
          <Divider />

          {loading && <LoadingComponent />}
          {!loading &&
            availableCurrencies.map(currency => (
              <ListItem
                key={currency.id}
                onClick={() => handleSelectAsset(currency.id)}
                className={`${style.hover} ${style.item} ${isSelected('ACA')}`}
                alignItems="center">
                <ListItemAvatar>
                  <Avatar className={style.avatar} alt={currency.id} src={currency.image}>
                    {acronym('A')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Typography className={style.header} component="span" color="textPrimary">
                    {currency.id}
                  </Typography>
                  <Typography className={style.subHeader} component="p" color="textSecondary">
                    {currency.id} Token
                  </Typography>
                </ListItemText>
                {selectedAsset === currency.id && (
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
