import {ChevronDownIcon} from '@heroicons/react/outline';
import {SearchIcon} from '@heroicons/react/outline';
import {XIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  Avatar,
  IconButton,
  InputBase,
  List,
  MenuItem,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';

import {formatUsd} from '../../helpers/balance';
import {Currency} from '../../interfaces/currency';
import {Transaction, TransactionSort} from '../../interfaces/transaction';
import {AvatarSize} from '../atoms/Avatar';
import {MenuOptions} from '../atoms/DropdownMenu';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {ListItemComponent} from '../atoms/ListItem';
import {Modal, ModalProps} from '../atoms/Modal';
import {SendTipButton} from '../common/SendTipButton/SendTipButton';
import {useStyles} from './TipHistory.styles';

// import {sortOptions} from './default';
import {debounce} from 'lodash';
import {Empty} from 'src/components/atoms/Empty';
import {Loading} from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {timeAgo} from 'src/helpers/date';
import {parseScientificNotatedNumber} from 'src/helpers/number';
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type TipHistoryProps = Pick<ModalProps, 'open' | 'onClose'> & {
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  hasMore: boolean;
  tips: Transaction[];
  currencies: Currency[];
  tippingDisabled: boolean;
  onSort: (sort: TransactionSort) => void;
  onFilter: (currency: string) => void;
  nextPage: () => void;
};

export const TipHistory: React.FC<TipHistoryProps> = props => {
  const {
    reference,
    referenceType,
    tips,
    hasMore,
    currencies,
    tippingDisabled,
    open,
    onClose,
    onSort,
    onFilter,
    nextPage,
  } = props;
  const {loading, exchangeRates} = useExchangeRate();

  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string>(i18n.t('Tipping_History.Modal.All_Coin'));

  useEffect(() => {
    if (selected === i18n.t('Tipping_History.Modal.All_Coin')) {
      setSearch('');
    } else {
      setSearch(selected);
    }
  }, [selected]);

  const sortOptions: MenuOptions<TransactionSort>[] = [
    {
      id: 'highest',
      title: i18n.t('Tipping_History.Modal.Sort_Highest'),
    },
    {
      id: 'latest',
      title: i18n.t('Tipping_History.Modal.Sort_Latest'),
    },
  ];

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
    setSelected(currency.symbol);
    onFilter(currency.id);
    handleClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSortChange = (sort: TransactionSort) => {
    onSort(sort);
  };

  const limitChar = (string = '', limit = 0): string => {
    return string.substring(0, limit);
  };

  const handleClearSearch = () => {
    setSearch('');
    onFilter('');
    setSelected(i18n.t('Tipping_History.Modal.All_Coin'));
  };

  return (
    <Modal title={i18n.t('Tipping_History.Modal.Title')} open={open} onClose={onClose}>
      <div className={styles.root}>
        <div className={styles.options}>
          <DropdownMenu<TransactionSort>
            title={i18n.t('Tipping_History.Modal.Sort')}
            options={sortOptions}
            onChange={handleSortChange}
            useIconOnMobile={false}
          />

          <div>
            <Typography component="span">{i18n.t('Tipping_History.Modal.Coin')}:&nbsp;</Typography>

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
                  placeholder={i18n.t('Tipping_History.Modal.Search_Coin')}
                  inputProps={{
                    'aria-label': 'search',
                  }}
                  startAdornment={
                    <SvgIcon
                      component={SearchIcon}
                      fontSize="small"
                      className={styles.searchIcon}
                    />
                  }
                  endAdornment={
                    search !== '' && (
                      <SvgIcon
                        component={XIcon}
                        fontSize="small"
                        className={styles.searchClear}
                        onClick={handleClearSearch}
                      />
                    )
                  }
                />

                {currencies
                  .filter(ar => ar.symbol.toLowerCase().includes(search.toLowerCase()))
                  .map(currency => (
                    <MenuItem
                      key={currency.id}
                      onClick={handleFilter(currency)}
                      className={styles.item}>
                      <ListItemComponent
                        size={AvatarSize.TINY}
                        title={currency.symbol}
                        avatar={currency.image}
                      />
                    </MenuItem>
                  ))}
              </div>
            </Menu>
          </div>
        </div>
      </div>

      <div className={styles.list}>
        <ShowIf condition={tips.length === 0}>
          <Empty title={i18n.t('Tipping_History.Modal.Empty')} subtitle="" margin={false} />
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
                  avatar={tip.fromWallet?.user.profilePictureURL || tip.fromWallet?.user.name}
                  title={
                    tip?.fromWallet?.user?.deletedAt
                      ? i18n.t('Tipping_History.Modal.User_Banned')
                      : limitChar(tip.fromWallet?.user.name, 16)
                  }
                  isBanned={!!tip?.fromWallet?.user?.deletedAt}
                  subtitle={timeAgo(tip.createdAt)}
                  size={AvatarSize.MEDIUM}
                  action={
                    <div className={styles.tip}>
                      <div>
                        <Typography variant="h5">
                          {parseScientificNotatedNumber(+tip.amount)} {tip.currency.symbol}
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
        <ShowIf condition={!tippingDisabled}>
          <SendTipButton
            label={i18n.t('Tipping_History.Modal.Send_Tip')}
            reference={reference}
            referenceType={referenceType}
            variant="contained"
            color="primary"
            fullWidth
          />
        </ShowIf>
      </div>
    </Modal>
  );
};
