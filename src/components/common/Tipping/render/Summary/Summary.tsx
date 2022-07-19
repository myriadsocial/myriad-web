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
import InfoIconYellow from 'src/images/icons/InfoIconYellow.svg';
import {BalanceDetail} from 'src/interfaces/balance';
import {People} from 'src/interfaces/people';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type SummaryProps = {
  amount: BN;
  transactionFee: BN;
  receiver: User | People;
  currency: BalanceDetail;
  loadingFee: boolean;
};

export const Summary: React.FC<SummaryProps> = props => {
  const {amount, transactionFee, receiver, currency, loadingFee} = props;
  console.log('currency', currency);

  const styles = useStyles();

  const total = amount.gt(BN_ZERO) ? amount.add(transactionFee) : BN_ZERO;

  return (
    <>
      <div className={styles.summary}>
        <Avatar src={receiver.profilePictureURL} name={receiver.name} size={AvatarSize.TINY} />
        <Typography variant="subtitle2" color="textPrimary" className={styles.description}>
          {`${receiver.name ?? 'Unnamed Myrian'} ${i18n.t('Tipping.Modal_Main.Will_Receive')} `}
          <FormatCurrency
            variant="subtitle2"
            color="primary"
            value={amount}
            currency={currency}
            className={styles.bold}
          />
        </Typography>
      </div>
      {receiver.walletDetail.referenceType !== 'wallet_address' && (
        <div className={styles.warningNoNear}>
          <div className={styles.wrapperIcon}>
            <InfoIconYellow />
          </div>
          <Typography className={styles.textWarning}>
            The tip will be stored in Myriad Escrow because the user hasn’t connected the
            {` ${currency.network.id === 'near' ? 'NEAR Wallet' : 'polkadot{.js}'} `}
            yet. Once they connect their{' '}
            {` ${currency.network.id === 'near' ? 'NEAR Wallet' : 'polkadot{.js}'}`}, they will be
            able to claim their tip.
          </Typography>
        </div>
      )}
      <div className={styles.detail}>
        <Typography className={styles.bold} gutterBottom>
          {i18n.t('Tipping.Modal_Main.Tip_Summary')}
        </Typography>
        <TableContainer>
          <Table size="small" aria-label="tip summary table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" classes={{root: styles.table}}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {i18n.t('Tipping.Modal_Main.Tip_Label')}
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
                    {i18n.t('Tipping.Modal_Main.Estimated_Gas_Fee')}
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
                  <ShowIf condition={loadingFee}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {i18n.t('General.Loading')}
                    </Typography>
                  </ShowIf>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" classes={{root: styles.table}}>
                  <Typography component="span" variant="subtitle2" color="textPrimary">
                    {i18n.t('Tipping.Modal_Main.Total')}
                  </Typography>
                </TableCell>
                <TableCell align="right" classes={{root: styles.table}}>
                  <ShowIf condition={!loadingFee}>
                    <FormatCurrency
                      className={styles.bold}
                      variant="subtitle2"
                      color="textPrimary"
                      value={total}
                      currency={currency}
                    />
                  </ShowIf>
                  <ShowIf condition={loadingFee}>
                    <Typography component="span" variant="subtitle2" color="textSecondary">
                      {i18n.t('General.Loading')}
                    </Typography>
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
