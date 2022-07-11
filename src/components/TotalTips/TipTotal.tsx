import React, {useEffect, useState} from 'react';

import {
  Button,
  List,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {Modal, ModalProps} from '../atoms/Modal';
import {useStyles} from './totalTips.style';

import {formatUsd} from 'src/helpers/balance';
import {ExchangeRate} from 'src/interfaces/exchange';
import {TotalTipsDataInterface} from 'src/interfaces/network';
import * as TokenAPI from 'src/lib/api/exchange';
import i18n from 'src/locale';

type TipTotalNearProps = Pick<ModalProps, 'onClose' | 'open'> & {
  totalTipsData: Array<TotalTipsDataInterface>;
  handleVerifyReference: () => void;
};

export const TipTotal: React.FC<TipTotalNearProps> = props => {
  const {open, onClose, totalTipsData, handleVerifyReference} = props;
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [loading, setLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  useEffect(() => {
    setLoading(true);
    TokenAPI.getExchangeRate()
      .then(data => {
        setExchangeRates(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [totalTipsData]);

  const getDetailExchangeRate = (symbol: string) => {
    return exchangeRates?.find(exchangeRate => exchangeRate.id === symbol)?.price ?? 0;
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      fullScreen={isMobile}
      title={'Total Tips'}
      subtitle={'You can claim all this tips after verified your reference.'}
      onClose={handleClose}
      open={open}
      className={styles.root}>
      <div>
        <TableContainer component={List}>
          <Table className={styles.root} aria-label="Balance Detail Table">
            <TableBody>
              {totalTipsData.length > 0 &&
                totalTipsData.map((balanceDetail, index) => (
                  <TableRow key={index} className={styles.tableRow}>
                    <TableCell component="th" scope="row" className={styles.tableCell}>
                      <Avatar
                        name={balanceDetail.symbol}
                        src={balanceDetail.imageURL}
                        size={AvatarSize.MEDIUM}
                      />
                      <Typography variant="h5" color="textPrimary">
                        {balanceDetail.symbol}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <div>
                        <Typography variant="body1" style={{fontWeight: 'bold'}}>
                          {Number(balanceDetail.amount).toFixed(4)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {`~${
                            loading
                              ? ''
                              : formatUsd(
                                  balanceDetail.amount as number,
                                  getDetailExchangeRate(balanceDetail.symbol),
                                )
                          } USD`}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={styles.wrapperButton}>
          <Button onClick={handleVerifyReference} color="primary" variant="contained">
            {i18n.t('Wallet.Tip.Reference.Button')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
