import {ChevronDownIcon} from '@heroicons/react/outline';
import {SearchIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import {
  Avatar,
  Button,
  IconButton,
  InputBase,
  List,
  MenuItem,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';

import {formatUsd} from '../../helpers/balance';
import {Currency, CurrencyId} from '../../interfaces/currency';
import {Transaction, TransactionSort} from '../../interfaces/transaction';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {ListItemComponent} from '../atoms/ListItem';
import {Modal, ModalProps} from '../atoms/Modal';
import {useStyles} from './TipHistory.styles';
import {sortOptions} from './default';

import {debounce} from 'lodash';
import {Empty} from 'src/components/atoms/Empty';
import {Loading} from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {timeAgo} from 'src/helpers/date';
import {parseScientificNotatedNumber} from 'src/helpers/number';
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

type TipHistoryProps = Pick<ModalProps, 'open' | 'onClose'> & {
  hasMore: boolean;
  tips: Transaction[];
  currencies: Currency[];
  tippingDisabled: boolean;
  sendTip: () => void;
  onSort: (sort: TransactionSort) => void;
  onFilter: (currency: CurrencyId) => void;
  nextPage: () => void;
};

export const TipHistory: React.FC<TipHistoryProps> = props => {
  const {
    tips,
    hasMore,
    currencies,
    tippingDisabled,
    open,
    onClose,
    sendTip,
    onSort,
    onFilter,
    nextPage,
  } = props;
  const {loading, exchangeRates} = useExchangeRate();

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string>('All Coin');

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getConversion = (currencyId: string) => {
    if (loading) {
      return 0;
    }

    const found = exchangeRates.find(exchangeRate => exchangeRate.id === currencyId);

    if (found) return found.price;
    return 0;
  };

  const handleFilter = (currency: Currency) => () => {
    setSelected(currency.id);
    onFilter(currency.id);
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortChange = (sort: string) => {
    onSort(sort as TransactionSort);
  };

  const limitChar = (string = '', limit = 0): string => {
    return string.substring(0, limit);
  };

  return (
    <Modal title="Tip History" open={open} onClose={onClose}>
      <div className={styles.root}>
        <div className={styles.options}>
          <DropdownMenu title="Sort by" options={sortOptions} onChange={handleSortChange} />

          <div>
            <Typography component="span">Coin:&nbsp;</Typography>

            <Typography component="span" color="textPrimary" className={styles.selected}>
              {selected}
            </Typography>

            <IconButton
              className={styles.expand}
              onClick={handleClick}
              color="primary"
              aria-label="expand">
              <SvgIcon component={ChevronDownIcon} fontSize="small" color="primary" />
            </IconButton>

            <Menu
              id="currency-option"
              classes={{
                paper: styles.menu,
              }}
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
              transformOrigin={{vertical: 'top', horizontal: 'center'}}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <div>
                <InputBase
                  className={styles.search}
                  onKeyUp={submitSearch}
                  value={search}
                  onChange={handleChange}
                  placeholder={`Search Coin`}
                  inputProps={{
                    'aria-label': 'search',
                  }}
                  startAdornment={<SvgIcon component={SearchIcon} fontSize="small" />}
                />

                {currencies.map(currency => (
                  <MenuItem
                    key={currency.id}
                    onClick={handleFilter(currency)}
                    className={styles.item}>
                    <ListItemComponent size="tiny" title={currency.id} avatar={currency.image} />
                  </MenuItem>
                ))}
              </div>
            </Menu>
          </div>
        </div>
      </div>

      <div className={styles.list}>
        <ShowIf condition={tips.length === 0}>
          <Empty title="Tip empty" subtitle="" />
        </ShowIf>
        <ShowIf condition={!!tips.length}>
          <List className={styles.list} id="scrollable-tip-history">
            <InfiniteScroll
              scrollableTarget="scrollable-tip-history"
              dataLength={tips.length}
              hasMore={hasMore}
              next={nextPage}
              loader={<Loading />}>
              {tips.map(tip => (
                <ListItemComponent
                  key={tip.id}
                  avatar={tip.fromUser.profilePictureURL || tip.fromUser.name}
                  title={
                    tip?.fromUser?.deletedAt ? '[user banned]' : limitChar(tip.fromUser.name, 16)
                  }
                  subtitle={timeAgo(tip.createdAt)}
                  size="medium"
                  action={
                    <div className={styles.tip}>
                      <div>
                        <Typography variant="h5">
                          {parseScientificNotatedNumber(tip.amount)} {tip.currencyId}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {`~${formatUsd(tip.amount, getConversion(tip.currencyId))} USD`}
                        </Typography>
                      </div>
                      <Avatar src={tip.currency.image} className={styles.logo} />
                    </div>
                  }
                />
              ))}
            </InfiniteScroll>
          </List>
        </ShowIf>
      </div>

      <div className={styles.action}>
        {tippingDisabled ? (
          <></>
        ) : (
          <Button
            disabled={balanceDetails.length === 0 || tippingDisabled}
            variant="contained"
            color="primary"
            disableElevation
            fullWidth
            onClick={sendTip}>
            {balanceDetails.length === 0 ? (
              <CircularProgress size={14} color="primary" />
            ) : (
              'I want to send tip too'
            )}
          </Button>
        )}
      </div>
    </Modal>
  );
};
