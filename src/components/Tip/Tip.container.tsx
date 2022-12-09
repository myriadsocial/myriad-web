import React from 'react';
import {useSelector} from 'react-redux';

import {useSession} from 'next-auth/react';

import {Backdrop, CircularProgress, NoSsr} from '@material-ui/core';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';
import {useStyles} from './tip.style';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {VariantType} from 'notistack';
import {Empty} from 'src/components/atoms/Empty';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {toHexPublicKey} from 'src/lib/crypto';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const TipContainer: React.FC = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const styles = useStyles();

  const {
    loading,
    claiming,
    claimingAll,
    verifyingReference,
    tipsEachNetwork,
    claim,
    claimAll,
    feeInfo,
    server,
    isSignerLoading,
    payTransactionFee,
  } = useClaimTip();

  const {loadingSwitch, switchNetwork} = useBlockchain();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const {data: session} = useSession();

  const networkId = session?.user?.networkType;

  const handleClaimTip = (ftIdentifier: string) => {
    claim(ftIdentifier, ({claimSuccess, errorMessage}) => {
      if (networkId === NetworkIdEnum.MYRIAD) {
        // TODO: Register translation
        const variant = claimSuccess ? 'success' : 'warning';
        const message = claimSuccess ? i18n.t('Wallet.Tip.Alert.Success') : errorMessage;

        enqueueSnackbar({message, variant});
      }
    });
  };

  const handleClaimTipAll = () => {
    claimAll(({claimSuccess, errorMessage}) => {
      if (networkId === NetworkIdEnum.MYRIAD) {
        // TODO: Register translation
        const variant = claimSuccess ? 'success' : 'warning';
        const message = claimSuccess ? i18n.t('Wallet.Tip.Alert.Success') : errorMessage;

        enqueueSnackbar({message, variant});
      }
    });
  };

  const isShow = (network: Network) => {
    if (network.id === networkId) return true;
    return false;
  };

  const handleVerifyReference = async (networkId: string) => {
    if (!user?.id) return;

    let message = 'Claiming Reference Success';
    let variant: VariantType = 'success';

    try {
      if (parseInt(feeInfo.trxFee) <= 0) {
        throw new Error('Insufficient Gas Fee');
      }

      if (!server?.accountId?.[networkId]) throw new Error('Server not exists');

      const serverId = server.accountId[networkId];
      const tipsBalanceInfo = {
        serverId: serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier: 'native',
      };

      let account = null;

      if (networkId === NetworkIdEnum.MYRIAD) {
        const installed = await enablePolkadotExtension();
        if (!installed) throw new Error('Polkadot{.js} extensions is not installed');
        const accounts = await getRegisteredAccounts();

        account = accounts.find(account => {
          const format = toHexPublicKey(account);
          if (format === session?.user?.address) return true;
          return false;
        });
        if (!account) throw new Error('Account not exists');
      }

      await payTransactionFee(tipsBalanceInfo, feeInfo.trxFee, account);
    } catch (error) {
      variant = error.message === 'Cancelled' ? 'warning' : 'error';
      message = error.message;
    } finally {
      enqueueSnackbar({variant, message});
    }
  };

  const showNetwork = (network: Network) => {
    if (!network.isUserHasTip) {
      if (!isShow(network)) return;

      switch (network.id) {
        case NetworkIdEnum.MYRIAD:
        case NetworkIdEnum.NEAR: {
          return (
            <div style={{marginTop: 20}} key={network.id}>
              <Empty
                title={i18n.t('Wallet.Tip.Empty.Title')}
                subtitle={i18n.t('Wallet.Tip.Empty.Subtitle')}
              />
            </div>
          );
        }

        default:
          return;
      }
    }

    return (
      <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'} key={network.id}>
        {showTip(network)}
      </BoxComponent>
    );
  };

  const showTip = (network: Network) => {
    if ((claimingAll || verifyingReference) && isShow(network)) return <ShimerComponent />;
    return (
      <Tip
        loading={claiming}
        network={network}
        onClaim={handleClaimTip}
        onClaimAll={handleClaimTipAll}
        onSwitchNetwork={switchNetwork}
        onHandleVerifyRef={handleVerifyReference}
        txFee={feeInfo.formattedTrxFee}
      />
    );
  };

  return (
    <NoSsr>
      {loading || loadingSwitch ? (
        <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
          <ShimerComponent />
        </BoxComponent>
      ) : (
        tipsEachNetwork.map(network => showNetwork(network))
      )}
      <Backdrop className={styles.backdrop} open={claimingAll || isSignerLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </NoSsr>
  );
};

export default TipContainer;
