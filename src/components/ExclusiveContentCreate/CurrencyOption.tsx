import {ChevronDownIcon} from '@heroicons/react/outline';

import React from 'react';

import Image from 'next/image';

import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './CurrencyOption.style';

import {Avatar, AvatarSize} from 'components/atoms/Avatar';
import {BalanceDetail} from 'src/interfaces/balance';
import i18n from 'src/locale';

export type CurrencyOptionProps = {
  currentCurrency: BalanceDetail;
  balances: BalanceDetail[];
  isMobile?: boolean;
  handleSelect: (BalanceDetail) => void;
};

export const CurrencyOption: React.FC<CurrencyOptionProps> = ({
  currentCurrency,
  balances,
  isMobile = false,
  handleSelect,
}) => {
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={styles.walletButton}
        startIcon={
          currentCurrency ? (
            <Image
              loader={() => currentCurrency?.image}
              src={currentCurrency?.image}
              alt={currentCurrency?.symbol}
              width={20}
              height={20}
              quality={100}
              className={styles.currencyIcon}
            />
          ) : null
        }
        endIcon={<SvgIcon color="primary" component={ChevronDownIcon} viewBox="0 0 24 24" />}
        size="small"
        variant="contained"
        color="inherit">
        <Typography component="span" className={currentCurrency ? null : styles.placeholder}>
          {currentCurrency
            ? currentCurrency?.symbol
            : i18n.t('ExclusiveContent.Label.ChangeCurrency')}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {balances.map(balance => (
          <MenuItem
            key={balance.id}
            onClick={() => {
              handleClose();
              handleSelect(balance);
            }}>
            <ListItemIcon>
              <Avatar
                name={balance.id}
                alt={balance.id}
                src={balance.image}
                size={AvatarSize.TINY}
              />
            </ListItemIcon>
            <ListItemText>{balance.symbol}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CurrencyOption;
