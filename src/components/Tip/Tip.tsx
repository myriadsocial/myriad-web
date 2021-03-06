import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {TipClaimReference} from './Tip.claim.reference';
import {useStyles} from './tip.style';

import {MenuOptions} from 'src/components/atoms/DropdownMenu';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import ShowIf from 'src/components/common/show-if.component';
import {NetworkIdEnum, TipResult} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';
import {BlockchainPlatform} from 'src/interfaces/wallet';
import i18n from 'src/locale';

type TipProps = {
  tips: TipResult[];
  networkId: NetworkIdEnum;
  blockchainPlatform: BlockchainPlatform;
  loading: boolean;
  nativeToken: string;
  currentWallet?: UserWallet;
  txFee?: string;
  onSuccess?: boolean;
  balance?: string;
  onClaim: (networkId: string, ftIdentifier: string) => void;
  onClaimAll: (networkId: string) => void;
  onHandleVerifyRef: (networkId: string, currentBalance: string | number) => void;
  onSwitchNetwork: (blockchainPlatform: string, networkId: string) => void;
};

const networkOptions: MenuOptions<string>[] = [
  {
    id: 'polkadot',
    title: 'Polkadot',
  },
  {
    id: 'kusama',
    title: 'Kusama',
  },
  {
    id: 'near',
    title: 'NEAR',
  },
  {
    id: 'myriad',
    title: 'Myriad',
  },
];

export const Tip: React.FC<TipProps> = props => {
  const {
    tips,
    networkId,
    blockchainPlatform,
    onClaim,
    onClaimAll,
    onHandleVerifyRef,
    onSwitchNetwork,
    nativeToken,
    currentWallet,
    loading,
    onSuccess = false,
    balance,
    txFee,
  } = props;

  const style = useStyles();

  const icons = React.useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon width={'24px'} height={'24px'} />,
      kusama: <KusamaNetworkIcon width={'24px'} height={'24px'} />,
      near: <NearNetworkIcon24 width={'24px'} height={'24px'} />,
      myriad: <MyriadCircleIcon width={'24px'} height={'24px'} />,
    }),
    [],
  );

  const handleClaim = (networkId: string, ftIdentifier: string) => {
    // PUT CODE HERE
    onClaim(networkId, ftIdentifier);
  };

  const handleClaimAll = () => {
    onClaimAll(networkId);
  };

  const handleSwitchNetwork = () => {
    onSwitchNetwork(blockchainPlatform, networkId);
  };

  const formatNetworkName = () => {
    const selected = networkOptions.find(e => e.id == networkId);

    return selected?.title;
  };

  const getAmount = (tip: TipResult) => {
    if (
      onSuccess &&
      balance &&
      tip.tipsBalanceInfo.ftIdentifier === 'native' &&
      tip.symbol === 'NEAR'
    ) {
      return balance;
    }

    return tip.amount;
  };

  const isShowVerifyReference = () => {
    const tip = tips.find(e => e.accountId === null);
    if (tip) return true;
    return false;
  };

  const showTokens = () => {
    if (isShowVerifyReference() && !onSuccess && networkId === currentWallet.networkId) {
      return (
        <TipClaimReference
          networkId={networkId}
          totalTipsData={tips}
          onHandleVerifyRef={onHandleVerifyRef}
          token={nativeToken}
          txFee={txFee}
        />
      );
    }

    return (
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        {tips.map((tip, i) => (
          <Grid item xs={6} key={i}>
            <div className={style.content}>
              <div className={style.flex}>
                <div>
                  <Avatar className={style.avatar} src={tip.imageURL} />
                  <Typography component="p" variant="h5">
                    {tip.symbol}
                  </Typography>
                </div>
                <Button
                  disabled={
                    (currentWallet && currentWallet.networkId !== networkId) ||
                    (!tip.accountId && !onSuccess) ||
                    loading
                  }
                  onClick={() => handleClaim(networkId, tip.tipsBalanceInfo.ftIdentifier)}
                  size="small"
                  className={style.buttonClaim}
                  color="primary"
                  variant="contained">
                  {i18n.t('Wallet.Tip.Claim')}
                </Button>
              </div>
              <div className={style.text}>
                <Typography variant="h5" component="p" color="textPrimary">
                  {getAmount(tip)}
                </Typography>
                <Typography variant="subtitle2" component="p" color="textSecondary">
                  USD {'~'}
                </Typography>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <ListItem alignItems="center" className={style.listItem}>
        <ListItemAvatar>{icons[networkId as keyof typeof icons]}</ListItemAvatar>
        <ListItemText>
          <Typography variant="h6" component="span" color="textPrimary">
            {formatNetworkName()}
          </Typography>
        </ListItemText>
        <div className={style.secondaryAction}>
          <ShowIf condition={!!currentWallet && currentWallet.networkId !== networkId}>
            <Button
              disabled={true}
              className={style.button}
              size="small"
              color="primary"
              variant="text"
              onClick={handleSwitchNetwork}>
              {i18n.t('Wallet.Tip.Switch')}
            </Button>
          </ShowIf>
          <ShowIf condition={!!currentWallet && currentWallet.networkId == networkId}>
            <Button
              disabled={isShowVerifyReference() && !onSuccess}
              className={style.button}
              size="small"
              color="primary"
              variant="text"
              onClick={handleClaimAll}>
              {i18n.t('Wallet.Tip.Claim_All')}
            </Button>
          </ShowIf>
        </div>
      </ListItem>
      {showTokens()}
      <Backdrop className={style.backdrop} open={loading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};
