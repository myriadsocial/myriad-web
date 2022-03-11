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

import {useStyles} from '.';
import {PrimaryCoinMenuContainer} from '../PrimaryCoinMenu/PrimaryCoinMenuContainer';
import {balanceSortOptions} from '../Timeline/default';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {DropdownMenu} from '../atoms/DropdownMenu';
import SearchComponent from '../atoms/Search/SearchBox';

import _ from 'lodash';
import {formatUsd} from 'src/helpers/balance';
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {BalanceDetail} from 'src/interfaces/balance';

type BalanceDetailListProps = {
  balanceDetails: BalanceDetail[];
  isLoading: boolean;
  onClickRefresh: () => void;
  onClickAddCoin: () => void;
};

export const BalanceDetailList: React.FC<BalanceDetailListProps> = props => {
  const {balanceDetails, isLoading} = props;

  // Make sure balance is showing, does not return empty JSX
  useEffect(() => {
    setDefaultBalanceDetails(balanceDetails);
  }, [balanceDetails]);

  const [isOnPrimaryCoinMenu, setIsOnPrimaryCoinMenu] = useState(false);
  const [defaultBalanceDetails, setDefaultBalanceDetails] = useState<BalanceDetail[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {loading, exchangeRates} = useExchangeRate();

  const getConversion = (currencyId: string) => {
    if (loading) {
      return 0;
    }

    const found = exchangeRates.find(exchangeRate => exchangeRate.id === currencyId);

    if (found) return found.price;
    return 0;
  };

  const handleChange = () => {
    // PUT CODE HERE
  };

  const handleSearch = (query: string) => {
    // PUT CODE HERE
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

  const handleSortChanged = (sort: string) => {
    switch (sort) {
      case 'aToZ': {
        const sortedAtoZBalances = _.sortBy(defaultBalanceDetails, 'id');
        setDefaultBalanceDetails(sortedAtoZBalances);
        break;
      }

      case 'highest': {
        const sortedHighestBalances = _.orderBy(defaultBalanceDetails, 'freeBalance', 'desc');
        setDefaultBalanceDetails(sortedHighestBalances);
        break;
      }

      case 'lowest': {
        const sortedLowestBalances = _.orderBy(defaultBalanceDetails, 'freeBalance', 'asc');
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
          placeholder={'Search coin'}
          iconPosition={'end'}
          outlined={true}
        />
        <IconButton disableRipple aria-label="refresh" onClick={handleOpenManageAssets}>
          <SvgIcon component={DotsVerticalIcon} color="inherit" />
        </IconButton>
      </div>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu title={'Sort'} options={balanceSortOptions} onChange={handleSortChanged} />
        <FormGroup>
          <FormControlLabel
            classes={{root: classes.formControl}}
            control={
              <Checkbox
                defaultChecked
                color="primary"
                onChange={handleChange}
                inputProps={{'aria-label': 'controlled'}}
                classes={{root: classes.fill}}
              />
            }
            label="Hide 0 balance"
          />
        </FormGroup>
      </div>
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
                      name={balanceDetail.id}
                      src={balanceDetail.image}
                      size={AvatarSize.MEDIUM}
                    />
                    <Typography variant="h5" color="textPrimary">
                      {balanceDetail.id}
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
      <Menu
        id="manage-assets"
        anchorEl={anchorEl}
        style={{width: 170}}
        classes={{paper: classes.menu}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseManageAssets}>
        <MenuItem onClick={handleOpenManageAsset}>Manage assets</MenuItem>
      </Menu>
    </>
  );
};
