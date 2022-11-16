import {DuplicateIcon} from '@heroicons/react/outline';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {isMobile} from 'react-device-detect';

import {TextField, InputAdornment} from '@material-ui/core';
import BaseButton from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './manage.style';
import {useWalletList, WalletOption} from './use-wallet-list.hook';

import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import ShowIf from 'src/components/common/show-if.component';
import {NetworkIdEnum} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';
import i18n from 'src/locale';

export type ManageProps = {
  currentWallet?: UserWallet;
  wallets: UserWallet[];
  onConnectDisconnect: (type: string, walletId?: string) => void;
};

const Button = WithAuthorizeAction(BaseButton);

export const Manage: React.FC<ManageProps> = ({currentWallet, wallets, onConnectDisconnect}) => {
  const style = useStyles();
  const enqueueSnackbar = useEnqueueSnackbar();
  const {walletList} = useWalletList(wallets);

  const handleLinkCopied = () => {
    enqueueSnackbar({
      message: i18n.t('Wallet.Manage.Alert.Copy_Msg'),
      variant: 'success',
    });
  };

  const disableWallet = (option: WalletOption) => {
    if (option.id === NetworkIdEnum.POLKADOT) {
      const substrateNetworks = [
        NetworkIdEnum.POLKADOT,
        NetworkIdEnum.MYRIAD,
        NetworkIdEnum.KUSAMA,
      ];
      const isSubstrateWallet = substrateNetworks.includes(
        currentWallet?.networkId as NetworkIdEnum,
      );

      return isSubstrateWallet ? true : false;
    } else {
      return option.id === currentWallet?.networkId ? true : false;
    }
  };

  return (
    <>
      <div>
        {walletList.map(option => (
          <ListItem alignItems={option.isConnect ? 'flex-start' : 'center'} key={option.id}>
            <ListItemAvatar>{option.icons}</ListItemAvatar>
            <ListItemText>
              <Typography variant="h5" component="div" color="textPrimary" className={style.name}>
                <div className={style.secondaryAction}>
                  <span>{option.title}</span>
                  <ShowIf condition={option.isConnect}>
                    <Button
                      variant="text"
                      size="small"
                      color="primary"
                      disabled={disableWallet(option)}
                      className={style.button}
                      onClick={() => onConnectDisconnect(option.id, option.walletId)}>
                      {i18n.t('Wallet.Manage.Btn_Disconnect')}
                    </Button>
                  </ShowIf>
                </div>
              </Typography>
              <ShowIf condition={option.isConnect}>
                <TextField
                  id="copy-wallet-address"
                  value={option.walletId}
                  variant="outlined"
                  disabled
                  fullWidth
                  margin="none"
                  className={style.input}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CopyToClipboard text={option.walletId} onCopy={handleLinkCopied}>
                          <IconButton aria-label="copy-post-link" style={{padding: 0}}>
                            <SvgIcon component={DuplicateIcon} color="primary" />
                          </IconButton>
                        </CopyToClipboard>
                      </InputAdornment>
                    ),
                  }}
                />
              </ShowIf>
            </ListItemText>
            <ShowIf condition={!option.isConnect}>
              <div className={style.secondaryAction}>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  disabled={isMobile}
                  className={style.btnConnect}
                  onClick={() => onConnectDisconnect(option.id)}>
                  {i18n.t('Wallet.Manage.Btn_Connect')}
                </Button>
              </div>
            </ShowIf>
          </ListItem>
        ))}
      </div>
    </>
  );
};
