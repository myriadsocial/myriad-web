import {CheckCircleIcon} from '@heroicons/react/solid';
import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {acronym} from '../../../helpers/string';
import {Modal} from '../Modal';
import {useStyles} from './AddCoin.style';
import {Props} from './addCoin.interface';

import {debounce} from 'lodash';

export const AddCoin: React.FC<Props> = props => {
  const {open, onClose} = props;
  const style = useStyles();
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

          <ListItem
            onClick={() => handleSelectAsset('ACA')}
            className={`${style.hover} ${style.item} ${isSelected('ACA')}`}
            alignItems="center">
            <ListItemAvatar>
              <Avatar
                className={style.avatar}
                alt={'name'}
                src={'https://res.cloudinary.com/dsget80gs/coins/aca.svg'}>
                {acronym('A')}
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Typography className={style.header} component="span" color="textPrimary">
                ACA
              </Typography>
              <Typography className={style.subHeader} component="p" color="textSecondary">
                Acala Token
              </Typography>
            </ListItemText>
            {selectedAsset === 'ACA' && (
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

          <ListItem
            onClick={() => handleSelectAsset('aUSD')}
            className={`${style.hover} ${style.item} ${isSelected('aUSD')}`}
            alignItems="center">
            <ListItemAvatar>
              <Avatar
                className={style.avatar}
                alt={'aUSD'}
                src={'https://res.cloudinary.com/dsget80gs/coins/ausd.png'}>
                {acronym('A')}
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Typography className={style.header} component="span" color="textPrimary">
                aUSD
              </Typography>
              <Typography className={style.subHeader} component="p" color="textSecondary">
                Appeal USD
              </Typography>
            </ListItemText>
            {selectedAsset === 'aUSD' && (
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
        </List>
        <Button className={style.button} fullWidth variant="contained" color="primary">
          Add to my wallet
        </Button>
      </div>
    </Modal>
  );
};
