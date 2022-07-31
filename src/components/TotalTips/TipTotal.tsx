import React from 'react';
import {useSelector} from 'react-redux';

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
import {TipsResult} from 'src/interfaces/blockchain-interface';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ExchangeRateState} from 'src/reducers/exchange-rate/reducer';

type TipTotalNearProps = Pick<ModalProps, 'onClose' | 'open'> & {
  tipsResults: TipsResult[];
  handleVerifyReference: () => void;
};

export const TipTotal: React.FC<TipTotalNearProps> = props => {
  const {open, onClose, tipsResults, handleVerifyReference} = props;
  const {exchangeRates} = useSelector<RootState, ExchangeRateState>(
    state => state.exchangeRateState,
  );
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

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
              {tipsResults.length > 0 &&
                tipsResults.map((balanceDetail, index) => (
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
                          {`~${formatUsd(
                            parseFloat(balanceDetail.amount),
                            getDetailExchangeRate(balanceDetail.symbol),
                          )} USD`}
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
