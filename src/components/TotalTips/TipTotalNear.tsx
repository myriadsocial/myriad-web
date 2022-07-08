import React from 'react';

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
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {TotalTipsDataInterface} from 'src/interfaces/network';
import i18n from 'src/locale';

type TipTotalNearProps = Pick<ModalProps, 'onClose' | 'open'> & {
  totalTipsData: Array<TotalTipsDataInterface>;
  handleVerifyReference: () => void;
};

export const TipTotalNear: React.FC<TipTotalNearProps> = props => {
  const {open, onClose, totalTipsData, handleVerifyReference} = props;
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const {loading, exchangeRates} = useExchangeRate();

  const getConversion = (currencyId: string) => {
    if (loading) {
      return 0;
    }

    const found = exchangeRates.find(exchangeRate => exchangeRate.id === currencyId);

    if (found) return found.price;
    return 0;
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
                totalTipsData.map(balanceDetail => (
                  <TableRow key={balanceDetail.id} className={styles.tableRow}>
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
                            balanceDetail.amount as number,
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
        <div className={styles.wrapperButton}>
          <Button onClick={handleVerifyReference} color="primary" variant="contained">
            {i18n.t('Wallet.Tip.Reference.Button')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
