import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {BN, BN_ZERO} from '@polkadot/util';

import {FormatCurrency} from '../FormatCurrency';
import {useStyles} from './Summary.style';

import {Avatar, AvatarSize} from 'src/components/atoms/Avatar';
import ShowIf from 'src/components/common/show-if.component';
import {BalanceDetail} from 'src/interfaces/balance';
import {People} from 'src/interfaces/people';
import {User} from 'src/interfaces/user';

type SummaryProps = {
  amount: BN;
  transactionFee: BN;
  receiver: User | People;
  currency: BalanceDetail;
  loadingFee: boolean;
};

export const Summary: React.FC<SummaryProps> = props => {
  const {amount, transactionFee, receiver, currency, loadingFee} = props;

  const styles = useStyles();

  const total = amount.gt(BN_ZERO) ? amount.add(transactionFee) : amount;

  return (
    <>
      <div className={styles.summary}>
        <Avatar src={receiver.profilePictureURL} name={receiver.name} size={AvatarSize.TINY} />
        <Typography variant="subtitle2" color="textPrimary" className={styles.description}>
          {receiver.name ?? `Unnamed Myrian`} will receive&nbsp;
          <FormatCurrency
            variant="subtitle2"
            color="primary"
            value={amount}
            currency={currency}
            className={styles.bold}
          />
        </Typography>
      </div>
      <div className={styles.detail}>
        <Typography className={styles.bold} gutterBottom>
          Tip Summary
        </Typography>
        <TableContainer>
          <Table size="small" aria-label="tip summary table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" classes={{root: styles.table}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Tip
                  </Typography>
                </TableCell>
                <TableCell align="right" classes={{root: styles.table}}>
                  <FormatCurrency
                    variant="subtitle2"
                    color="textSecondary"
                    value={amount}
                    currency={currency}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" classes={{root: styles.table}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Estimated gas fee
                  </Typography>
                </TableCell>
                <TableCell align="right" classes={{root: styles.table}}>
                  <ShowIf condition={!loadingFee}>
                    <FormatCurrency
                      variant="subtitle2"
                      color="textSecondary"
                      value={transactionFee}
                      currency={currency}
                    />
                  </ShowIf>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" classes={{root: styles.table}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total
                  </Typography>
                </TableCell>
                <TableCell align="right" classes={{root: styles.table}}>
                  <ShowIf condition={!loadingFee}>
                    <FormatCurrency
                      className={styles.bold}
                      variant="subtitle2"
                      color="textSecondary"
                      value={total}
                      currency={currency}
                    />
                  </ShowIf>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};
