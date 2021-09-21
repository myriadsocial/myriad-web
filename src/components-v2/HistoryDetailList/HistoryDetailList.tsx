import React from 'react';

import List from '@material-ui/core/List';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {TransactionHistoryDetail, TipStatus} from '../../interfaces/transaction';
import {
  historyAmountSortOptions,
  historyCoinSortOptions,
  historyTransactionSortOptions,
} from '../Timeline/default';
import {DropdownMenu} from '../atoms/DropdownMenu/';
import {CustomAvatar, CustomAvatarSize} from '../atoms/avatar/';
import {useStyles} from './history-detail-list.styles';

type HistoryDetailListProps = {
  historyDetails: TransactionHistoryDetail[];
};

export const HistoryDetailList: React.FC<HistoryDetailListProps> = props => {
  const {historyDetails} = props;

  const classes = useStyles();
  return (
    <>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu title={'Sort'} options={historyAmountSortOptions} />
        <div className={classes.leftJustifiedWrapper}>
          <DropdownMenu title={'Coin'} options={historyCoinSortOptions} />
          <DropdownMenu title={'Transaction'} options={historyTransactionSortOptions} />
        </div>
      </div>
      <TableContainer component={List}>
        <Table className={classes.root} aria-label="history details table">
          <TableBody>
            {historyDetails.map(historyDetail => (
              <TableRow key={historyDetail.id} className={classes.tableRow}>
                <TableCell component="th" scope="row" className={classes.tableCell}>
                  <CustomAvatar
                    size={CustomAvatarSize.MEDIUM}
                    alt={historyDetail.to.name}
                    avatar={historyDetail.to.profilePictureURL ?? ''}
                  />

                  <div>
                    <Typography variant="body1" style={{fontWeight: 'bold'}}>
                      {historyDetail.to.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      20 seconds ago
                    </Typography>
                  </div>
                </TableCell>

                <TableCell align="center">
                  {historyDetail.tipStatus === TipStatus.RECEIVED && (
                    <div className={classes.tipStatusGreen}>
                      <Typography variant="caption">Tipped</Typography>
                    </div>
                  )}
                  {historyDetail.tipStatus === TipStatus.SENT && (
                    <div className={classes.tipStatusRed}>
                      <Typography variant="caption">Sent</Typography>
                    </div>
                  )}
                </TableCell>

                <TableCell align="right">
                  <div className={classes.currencyDetailWrapper}>
                    <div>
                      {historyDetail.tipStatus === TipStatus.RECEIVED && (
                        <Typography variant="h5" className={classes.textAmountGreen}>
                          +{historyDetail.amount} {historyDetail.currency.name}
                        </Typography>
                      )}
                      {historyDetail.tipStatus === TipStatus.SENT && (
                        <Typography variant="h5" className={classes.textAmountRed}>
                          -{historyDetail.amount} {historyDetail.currency.name}
                        </Typography>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        {'~15.25 USD'}
                      </Typography>
                    </div>
                    <div>
                      <CustomAvatar
                        size={CustomAvatarSize.XSMALL}
                        alt={historyDetail.currency.name}
                        avatar={historyDetail.currency.image}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
