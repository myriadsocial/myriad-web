import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './tip.style';

import {MenuOptions} from 'src/components/atoms/DropdownMenu';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import ShowIf from 'src/components/common/show-if.component';
import {UserWallet} from 'src/interfaces/user';
import {TipResult} from 'src/lib/services/polkadot-js';

type TipProps = {
  tips: TipResult[];
  network: string;
  currentWallet?: UserWallet;
  onClaim: (networkId: string, ftIdentifier: string) => void;
  onClaimAll: (networkId: string) => void;
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

export const Tip: React.FC<TipProps> = ({tips, network, onClaim, onClaimAll, currentWallet}) => {
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
    onClaimAll(network);
  };

  const formatNetworkName = () => {
    const result = networkOptions.find(option => option.id == network);
    return result?.title;
  };

  return (
    <>
      <ListItem alignItems="center" className={style.listItem}>
        <ListItemAvatar>{icons[network as keyof typeof icons]}</ListItemAvatar>
        <ListItemText>
          <Typography variant="h6" component="span" color="textPrimary">
            {formatNetworkName()}
          </Typography>
        </ListItemText>
        <div className={style.secondaryAction}>
          <ShowIf condition={!!currentWallet && currentWallet.network !== network}>
            <Typography>Switch network to claim</Typography>
          </ShowIf>
          <ShowIf condition={!!currentWallet && currentWallet.network == network}>
            <Button
              className={style.button}
              size="small"
              color="primary"
              variant="text"
              onClick={handleClaimAll}>
              Claim all
            </Button>
          </ShowIf>
        </div>
      </ListItem>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        {tips.map((tip, i) => (
          <Grid item xs={6} key={i}>
            <div className={style.content}>
              <div className={style.flex}>
                <div>
                  <MyriadCircleIcon width={'32px'} height={'32px'} />
                  <Typography component="p" variant="h5">
                    {tip.tipsBalanceInfo.ftIdentifier == 'native'
                      ? 'MYRIA'
                      : tip.tipsBalanceInfo.ftIdentifier}
                  </Typography>
                </div>
                <Button
                  disabled={currentWallet && currentWallet.network !== network}
                  onClick={() => handleClaim(network, tip.tipsBalanceInfo.ftIdentifier)}
                  size="small"
                  className={style.buttonClaim}
                  color="primary"
                  variant="contained">
                  Claim
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
    </>
  );
};
