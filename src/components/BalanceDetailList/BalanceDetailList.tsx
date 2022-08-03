import {DotsVerticalIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {useStyles, ShimerComponent} from '.';
import {PrimaryCoinMenuContainer} from '../PrimaryCoinMenu/PrimaryCoinMenuContainer';
import {BalanceSortType} from '../Timeline/default';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {DropdownMenu, MenuOptions} from '../atoms/DropdownMenu';
import SearchComponent from '../atoms/Search/SearchBox';

import orderBy from 'lodash/orderBy';
import {Empty} from 'src/components/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';
import {formatUsd} from 'src/helpers/balance';
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import i18n from 'src/locale';

type BalanceDetailListProps = {
  balanceDetails: BalanceDetail[];
  isLoading: boolean;
  onClickRefresh: () => void;
  onClickAddCoin: () => void;
};

export const BalanceDetailList: React.FC<BalanceDetailListProps> = props => {
  const {balanceDetails, isLoading} = props;

  const [checked, setChecked] = React.useState(true);
  const [isSearch, setIsSearch] = React.useState(false);
  const [isOnPrimaryCoinMenu, setIsOnPrimaryCoinMenu] = useState(false);
  const [defaultBalanceDetails, setDefaultBalanceDetails] = useState<BalanceDetail[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {loading, exchangeRates} = useExchangeRate();

  const balanceSortOptions: MenuOptions<BalanceSortType>[] = [
    {
      id: 'highest',
      title: i18n.t('Wallet.Balance.Sort_Opt.Highest'),
    },
    {
      id: 'lowest',
      title: i18n.t('Wallet.Balance.Sort_Opt.Lowest'),
    },
  ];

  // Make sure balance is showing, does not return empty JSX
  useEffect(() => {
    setDefaultBalanceDetails(balanceDetails);
    handleHideZeroBalances();
  }, [balanceDetails, checked]);

  const getConversion = (currencyId: string) => {
    if (loading) {
      return 0;
    }

    const found = exchangeRates.find(exchangeRate => exchangeRate.id === currencyId);

    if (found) return found.price;
    return 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleHideZeroBalances = () => {
    if (checked) {
      setDefaultBalanceDetails(balanceDetails.filter(balance => balance.freeBalance > 0));
    } else setDefaultBalanceDetails(balanceDetails);
  };

  const handleSearch = (query: string) => {
    const regex = new RegExp(`^${query.toLowerCase()}`, 'i');

    const result = balanceDetails.filter(balance => balance.name.toLowerCase().match(regex));

    if (!query) setDefaultBalanceDetails(balanceDetails);
    else setDefaultBalanceDetails(result);
    setIsSearch(!!query);
  };

  const handleOpenManageAssets = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseManageAssets = () => {
    setAnchorEl(null);
  };

  const handleOpenManageAsset = () => {
    togglePrimaryCoinMenu();
    handleCloseManageAssets();
  };

  const handleSortChanged = (sort: BalanceSortType) => {
    switch (sort) {
      case 'highest': {
        const sortedHighestBalances = orderBy(defaultBalanceDetails, 'freeBalance', 'desc');
        setDefaultBalanceDetails(sortedHighestBalances);
        break;
      }

      case 'lowest': {
        const sortedLowestBalances = orderBy(defaultBalanceDetails, 'freeBalance', 'asc');
        setDefaultBalanceDetails(sortedLowestBalances);
        break;
      }

      default: {
        break;
      }
    }
  };

  const togglePrimaryCoinMenu = () => {
    setIsOnPrimaryCoinMenu(!isOnPrimaryCoinMenu);
  };

  const classes = useStyles();

  if (isOnPrimaryCoinMenu)
    return (
      <>
        <PrimaryCoinMenuContainer togglePrimaryCoinMenu={togglePrimaryCoinMenu} />
      </>
    );

  return (
    <>
      <div className={classes.search}>
        <SearchComponent
          onSubmit={handleSearch}
          placeholder={i18n.t('Wallet.Balance.Search_Plc')}
          iconPosition={'end'}
          outlined={true}
        />
        <IconButton disableRipple aria-label="refresh" onClick={handleOpenManageAssets}>
          <SvgIcon component={DotsVerticalIcon} color="inherit" />
        </IconButton>
      </div>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu<BalanceSortType>
          title={i18n.t('Wallet.Balance.Sort')}
          options={balanceSortOptions}
          onChange={handleSortChanged}
          disabled={isSearch}
          useIconOnMobile={false}
        />
        <FormGroup>
          <FormControlLabel
            disabled={isSearch}
            classes={{root: classes.formControl}}
            control={
              <Checkbox
                checked={checked}
                color="primary"
                onChange={handleChange}
                inputProps={{'aria-label': 'controlled'}}
                classes={{root: classes.fill}}
              />
            }
            label={i18n.t('Wallet.Balance.Hide_0')}
          />
        </FormGroup>
      </div>
      <ShowIf condition={isLoading}>
        <ShimerComponent />
      </ShowIf>

      <ShowIf condition={!defaultBalanceDetails.length && !isLoading && isSearch}>
        <Empty
          title={i18n.t('Wallet.Balance.Search_Empty.Title')}
          subtitle={i18n.t('Wallet.Balance.Search_Empty.Subtitle')}
        />
      </ShowIf>

      <ShowIf condition={!!defaultBalanceDetails.length && !isLoading && !isSearch}>
        <TableContainer component={List}>
          <Table className={classes.root} aria-label="Balance Detail Table">
            <TableBody>
              {isLoading && defaultBalanceDetails.length === 0 && (
                <TableRow className={classes.loading}>
                  <CircularProgress />
                </TableRow>
              )}
              {!isLoading &&
                defaultBalanceDetails.length > 0 &&
                defaultBalanceDetails.map(balanceDetail => (
                  <TableRow key={balanceDetail.id} className={classes.tableRow}>
                    <TableCell component="th" scope="row" className={classes.tableCell}>
                      <Avatar
                        name={balanceDetail.symbol}
                        src={balanceDetail.image}
                        size={AvatarSize.MEDIUM}
                      />
                      <Typography variant="h5" color="textPrimary">
                        {balanceDetail.symbol}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <div>
                        <Typography variant="body1" style={{fontWeight: 'bold'}}>
                          {parseFloat(balanceDetail.freeBalance.toFixed(4))}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {`~${formatUsd(
                            balanceDetail.freeBalance,
                            getConversion(balanceDetail.id),
                          )} USD`}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ShowIf>

      <Menu
        id="manage-assets"
        anchorEl={anchorEl}
        style={{width: 170}}
        classes={{paper: classes.menu}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseManageAssets}>
        <MenuItem onClick={handleOpenManageAsset}>{i18n.t('Wallet.Balance.Manage')}</MenuItem>
      </Menu>
    </>
  );
};
