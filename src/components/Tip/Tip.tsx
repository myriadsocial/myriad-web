import React from 'react';

import {useSession} from 'next-auth/react';

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

import {capitalize} from 'lodash';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import ShowIf from 'src/components/common/show-if.component';
import {strToJson} from 'src/helpers/string';
import {CURRENT_NETWORK_KEY, Network, NetworkIdEnum} from 'src/interfaces/network';
import i18n from 'src/locale';

type TipProps = {
  network: Network;
  loading: boolean;
  txFee?: string;
  onClaim: (ftIdentifier: string) => void;
  onClaimAll: () => void;
  onHandleVerifyRef: (networkId: string) => void;
  onSwitchNetwork: (network: Network) => void;
};

export const Tip: React.FC<TipProps> = props => {
  const {network, onClaim, onClaimAll, onHandleVerifyRef, onSwitchNetwork, loading, txFee} = props;

  const style = useStyles();

  const {data: session} = useSession();

  const currencies = network?.currencies ?? [];
  const icons = React.useMemo(
    () => ({
      polkadot: <PolkadotNetworkIcon width={'24px'} height={'24px'} />,
      kusama: <KusamaNetworkIcon width={'24px'} height={'24px'} />,
      near: <NearNetworkIcon24 width={'24px'} height={'24px'} />,
      myriad: <MyriadCircleIcon width={'24px'} height={'24px'} />,
    }),
    [],
  );

  const handleClaim = (ftIdentifier: string) => {
    onClaim(ftIdentifier);
  };

  const handleClaimAll = () => {
    onClaimAll();
  };

  const handleSwitchNetwork = () => {
    onSwitchNetwork(network);
  };

  const formatNetworkName = (networkId: NetworkIdEnum) => {
    if (networkId === NetworkIdEnum.NEAR) return networkId.toUpperCase();
    return capitalize(networkId);
  };

  const showTokens = () => {
    if (network.hasToClaimed && network.id === session?.user?.networkType) {
      const networkStringify = window.localStorage.getItem(CURRENT_NETWORK_KEY);
      const currentNetwork = strToJson<Network>(networkStringify);
      const nativeToken = currentNetwork.currencySymbol ?? '';

      return (
        <TipClaimReference
          tipsResults={currencies}
          onHandleVerifyRef={onHandleVerifyRef}
          token={nativeToken}
          txFee={txFee}
        />
      );
    }

    return (
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        {currencies.map((tip, i) => (
          <Grid item xs={12} md={6} key={i}>
            <div className={style.content}>
              <div className={style.flex}>
                <div>
                  <Avatar className={style.avatar} src={tip.image} />
                  <Typography component="p" variant="h5">
                    {tip.symbol}
                  </Typography>
                </div>
                <Button
                  disabled={
                    session?.user?.networkType !== network.id || loading || network.hasToClaimed
                  }
                  onClick={() => handleClaim(tip?.referenceId ?? 'native')}
                  size="small"
                  className={style.buttonClaim}
                  color="primary"
                  variant="contained">
                  {i18n.t('Wallet.Tip.Claim')}
                </Button>
              </div>
              <div className={style.text}>
                <Typography variant="h5" component="p" color="textPrimary">
                  {tip.amount}
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
        <ListItemAvatar>{icons[network.id as keyof typeof icons]}</ListItemAvatar>
        <ListItemText>
          <Typography variant="h6" component="span" color="textPrimary">
            {formatNetworkName(network.id)}
          </Typography>
        </ListItemText>
        <div className={style.secondaryAction}>
          <ShowIf condition={session?.user?.networkType !== network.id}>
            <Button
              disabled
              className={style.button}
              size="small"
              color="primary"
              variant="text"
              onClick={handleSwitchNetwork}>
              {i18n.t('Wallet.Tip.Switch')}
            </Button>
          </ShowIf>
          <ShowIf condition={session?.user?.networkType == network.id}>
            <Button
              disabled={network.hasToClaimed}
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
