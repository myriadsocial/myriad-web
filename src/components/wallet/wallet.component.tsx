import React, {createRef, forwardRef} from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';

import {LoadingPage} from '../common/loading.component';
import ExpandablePanel from '../common/panel-expandable.component';
import {useStyles} from './wallet.style';

import {Currency} from 'src/interfaces/currency';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const BalanceComponent = dynamic(() => import('./balance.component'));

const TransactionComponent = dynamic(() => import('./transactions/transaction.component'));

const WalletSettingComponent = dynamic(() => import('./walletSetting.component'));

type Props = {
  availableTokens: Currency[];
};

const ForwardedBalanceComponent = forwardRef(({availableTokens}: Props, ref) => (
  <BalanceComponent availableTokens={availableTokens} forwardedRef={ref} />
));

const ForwardedTransactionComponent = forwardRef((props, ref) => (
  <TransactionComponent {...props} forwardedRef={ref} />
));

const ForwardedWalletSettingComponent = forwardRef((props, ref) => (
  <WalletSettingComponent {...props} forwardedRef={ref} />
));

export const Wallet = React.memo(function Wallet() {
  const style = useStyles();

  const transactionRef = createRef<any>();

  const balanceRef = createRef<any>();

  const walletSettingRef = createRef<any>();

  const {
    loading,
    anonymous,
    currencies: userTokens,
  } = useSelector<RootState, UserState>(state => state.userState);

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    transactionRef.current?.triggerRefresh();
    balanceRef.current?.triggerRefresh();
  };

  const handleWalletSetting = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    walletSettingRef.current?.triggerShowSetting();
  };

  type WalletActionProps = {
    disabled?: boolean;
  };

  const WalletAction = ({disabled}: WalletActionProps) => {
    return (
      <div className={style.walletActions}>
        <IconButton
          color="default"
          size="small"
          aria-label="refresh-wallet"
          onClick={handleRefresh}
          disabled={disabled}
          onFocus={event => event.stopPropagation()}>
          <RefreshIcon />
        </IconButton>
        <IconButton
          color="default"
          size="small"
          aria-label="wallet-settings"
          disabled={disabled}
          onClick={handleWalletSetting}
          onFocus={event => event.stopPropagation()}>
          <SettingsIcon />
        </IconButton>
      </div>
    );
  };

  if (loading)
    return (
      <ExpandablePanel
        title="My Wallet"
        actions={<WalletAction disabled={true} />}
        isDisabled={anonymous}>
        <LoadingPage />
      </ExpandablePanel>
    );

  return (
    <div id="wallet">
      <ExpandablePanel
        title="My Wallet"
        actions={<WalletAction disabled={false} />}
        isDisabled={anonymous}>
        <ForwardedBalanceComponent ref={balanceRef} availableTokens={userTokens} />
        <Divider variant="middle" />
        <ForwardedTransactionComponent ref={transactionRef} />
      </ExpandablePanel>

      <ForwardedWalletSettingComponent ref={walletSettingRef} />
    </div>
  );
});
