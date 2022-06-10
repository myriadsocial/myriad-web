import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {
  Typography,
  Radio,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  SvgIcon,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {useStyles} from './HistoryDetailList.styles';

import {MenuOptions} from 'components/atoms/DropdownMenu';
import {Modal} from 'components/atoms/Modal';
import i18n from 'src/locale';

export type HistoryFilterModalProps = {
  open: boolean;
  onClose: () => void;
  filterOption: MenuOptions<string>[];
  currencyOption: MenuOptions<string>[];
  changeFilter: (option: string) => void;
  selectedFilter?: string;
  selectedCurrency?: string;
  changeCurrency: (option: string) => void;
};

export const HistoryFilterModal: React.FC<HistoryFilterModalProps> = props => {
  const {
    open,
    onClose,
    filterOption,
    selectedFilter = 'all',
    changeFilter,
    currencyOption,
    selectedCurrency = 'all',
    changeCurrency,
  } = props;
  const style = useStyles();

  const [filter, setFilter] = useState<string>(selectedFilter);
  const [openCurrencyList, setOpenCurrencyList] = useState(false);
  const [currency, setCurrency] = useState<string>(selectedCurrency);

  const onApply = () => {
    changeFilter(filter);
    changeCurrency(currency);
    onClose();
  };

  const onReset = () => {
    changeFilter('all');
    changeCurrency('all');
    onClose();
  };

  return (
    <Modal title="Filter" onClose={onClose} open={open} fullScreen>
      <div>
        <Typography>{i18n.t('Wallet.History.Transaction')}</Typography>
        <List dense={false} className={style.filterList}>
          {filterOption.map(option => (
            <ListItem key={option.id} button onClick={() => setFilter(option.id)}>
              <Radio
                edge="end"
                checked={filter === option.id}
                value={option.id}
                name="radio-buttons"
                inputProps={{'aria-labelledby': option.id}}
              />
              <ListItemText primary={option.title} className={style.optionFilterText} />
            </ListItem>
          ))}
        </List>
        <Autocomplete
          id="combo-box-demo"
          options={currencyOption}
          getOptionLabel={option => option.title}
          style={{width: '100%'}}
          open={openCurrencyList}
          value={currencyOption.filter(ar => ar.id === currency)[0]}
          onChange={(event, newValue) => {
            if (newValue) {
              const tmpVal: MenuOptions<string> = newValue as MenuOptions<string>;
              setCurrency(tmpVal.id);
              setOpenCurrencyList(false);
            }
          }}
          onFocus={() => setOpenCurrencyList(true)}
          onBlur={() => setOpenCurrencyList(false)}
          renderInput={params => (
            <TextField
              {...params}
              label={i18n.t('Wallet.History.Coin')}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    <IconButton
                      aria-label="copy-post-link"
                      style={{padding: 0, position: 'absolute', right: 20}}
                      onClick={() => setOpenCurrencyList(!openCurrencyList)}>
                      <SvgIcon component={ChevronDownIcon} />
                    </IconButton>
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={onApply}
          className={style.btnApply}>
          {i18n.t('Wallet.History.Filter.Btn_Apply')}
        </Button>
        <Button
          size="medium"
          variant="outlined"
          color="secondary"
          onClick={onReset}
          className={style.btnReset}>
          {i18n.t('Wallet.History.Filter.Btn_Reset')}
        </Button>
      </div>
    </Modal>
  );
};
