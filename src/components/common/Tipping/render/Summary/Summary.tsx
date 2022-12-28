import React from 'react';
import {useSelector} from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {BN, BN_ZERO} from '@polkadot/util';

import {PeopleWithWalletDetail, UserWithWalletDetail} from '../../Tipping.interface';
import {FormatCurrency} from '../FormatCurrency';
import {useStyles} from './Summary.style';

import {Avatar, AvatarSize} from 'src/components/atoms/Avatar';
import ShowIf from 'src/components/common/show-if.component';
import InfoIconYellow from 'src/images/Icons/InfoIconYellow.svg';
import {BalanceDetail} from 'src/interfaces/balance';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type SummaryProps = {
  amount: BN;
  transactionFee: BN;
  receiver: UserWithWalletDetail | PeopleWithWalletDetail;
  currency: BalanceDetail;
  loadingFee: boolean;
  nativeSymbol: string;
  isTipping?: boolean;
};

export const Summary: React.FC<SummaryProps> = props => {
  const {
    amount,
    transactionFee,
    receiver,
    currency,
    loadingFee,
    nativeSymbol,
    isTipping = true,
  } = props;
  const {currentWallet} = useSelector<RootState, UserState>(state => state.userState);

  const styles = useStyles();

  const total = amount.gt(BN_ZERO)
    ? currency.native
      ? amount.add(transactionFee)
      : amount
    : BN_ZERO;

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
            nativeSymbol={nativeSymbol}
          />
        </Typography>
      </div>
      <ShowIf condition={isTipping}>
        {receiver.walletDetail?.referenceType !== 'wallet_address' && (
          <div className={styles.warningNoNear}>
            <div className={styles.wrapperIcon}>
              <InfoIconYellow />
            </div>
            <Typography className={styles.textWarning}>
              The tip will be stored in Myriad Escrow because the user hasn’t connected the
              {` ${currentWallet.networkId === 'near' ? 'NEAR Wallet' : 'polkadot{.js}'} `}
              yet. Once they connect their{' '}
              {` ${currentWallet.networkId === 'near' ? 'NEAR Wallet' : 'polkadot{.js}'}`}, they
              will be able to claim their tip.
            </Typography>
          </div>
        )}
      </ShowIf>
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
                    nativeSymbol={nativeSymbol}
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
                      nativeSymbol={nativeSymbol}
                      trxFee={true}
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
                      nativeSymbol={nativeSymbol}
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
