import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {Backdrop, CircularProgress, NoSsr} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';
import {useStyles} from './tip.style';

import {PolkadotAccountList} from 'components/PolkadotAccountList';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {VariantType} from 'notistack';
import {Empty} from 'src/components/atoms/Empty';
import {getServerId} from 'src/helpers/wallet';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {Network, NetworkIdEnum, TipResult, TipsBalanceInfo} from 'src/interfaces/network';
import {updateTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const {publicRuntimeConfig} = getConfig();

export const TipContainer: React.FC = () => {
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();
  const styles = useStyles();

  const {currentWallet, user} = useSelector<RootState, UserState>(state => state.userState);
  const {payTransactionFee: payNearTransactionFee} = useNearApi();
  const {loading, claiming, claimingAll, tipsEachNetwork, claim, claimAll, feeInfo} = useClaimTip();
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {payTransactionFee: payMyriaTransactionFee, isSignerLoading} = usePolkadotApi();
  const {getRegisteredAccounts} = useAuthHook();
  const [verifyingRef, setVerifyingRef] = useState<boolean>(false);
  const [claimingSuccess, setClaimingSucces] = useState<boolean>(false);
  const [showAccountList, setShowAccountList] = useState<boolean>(false);
  const [extensionInstalled, setExtensionInstalled] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [tipsBalanceInfo, setTipsBalanceInfo] = useState<TipsBalanceInfo>(null);

  const transactionHashes = router.query.transactionHashes as string | null;
  const errorCode = router.query.errorCode as string | null;
  const errorMessage = router.query.errorMessage as string | null;
  const txFee = router.query.txFee as string | null;
  const amount = router.query.balance as string | null;
  const txInfo = router.query.txInfo as string | null;

  useEffect(() => {
    if (!txFee && !txInfo && transactionHashes) {
      enqueueSnackbar({
        message: i18n.t('Wallet.Tip.Alert.Success'),
        variant: 'success',
      });
    }

    if (errorCode && errorMessage) {
      enqueueSnackbar({
        // TODO: Register Translation
        message: decodeURI(errorMessage),
        variant: 'warning',
      });
    }

    if (txInfo && !errorCode && !errorMessage) {
      updateTransaction(JSON.parse(txInfo)).catch(() => console.log);
    }

    if (txFee && !errorCode && !errorMessage) {
      let success = true;
      let message = 'Claiming Reference Success';
      let variant: VariantType = 'success';

      setVerifyingRef(true);

      const tippingContractId = publicRuntimeConfig.nearTippingContractId;
      WalletAPI.claimReference({txFee, tippingContractId})
        .catch(e => {
          success = false;
          message = e.message;
          variant = 'error';
        })
        .finally(() => {
          setClaimingSucces(success);
          setVerifyingRef(false);

          // TODO: Register Translation
          enqueueSnackbar({message, variant});
        });
    }

    const url = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

    url.search = amount ? `?balance=${amount}` : '';

    router.replace(url, undefined, {shallow: true});
  }, [errorCode, transactionHashes, errorMessage, txFee, amount]);

  const handleClaimTip = (networkId: string, ftIdentifier: string) => {
    claim(networkId, ftIdentifier, ({claimSuccess, errorMessage}) => {
      if (networkId === NetworkIdEnum.MYRIAD) {
        // TODO: Register translation
        const variant = claimSuccess ? 'success' : 'warning';
        const message = claimSuccess ? i18n.t('Wallet.Tip.Alert.Success') : errorMessage;

        enqueueSnackbar({message, variant});
      }
    });
  };

  const handleClaimTipAll = (networkId: string) => {
    claimAll(networkId, ({claimSuccess, errorMessage}) => {
      if (networkId === NetworkIdEnum.MYRIAD) {
        // TODO: Register translation
        const variant = claimSuccess ? 'success' : 'warning';
        const message = claimSuccess ? i18n.t('Wallet.Tip.Alert.Success') : errorMessage;

        enqueueSnackbar({message, variant});
      }
    });
  };

  const tipWithBalances = (network: Network) => {
    return network?.tips.filter(tip => Math.ceil(Number(tip.amount)) > 0) ?? [];
  };

  const isShow = (network: Network) => {
    if (network.id === currentWallet?.networkId) return true;
    return false;
  };

  const handleVerifyReference = async (networkId: string, currentBalance: string | number) => {
    if (!user?.id) return;

    setVerifyingRef(true);

    try {
      if (parseInt(feeInfo.trxFee) <= 0) {
        throw new Error('Insufficient Gas Fee');
      }

      const server = await WalletAPI.getServer();
      const serverId = getServerId(server, currentWallet?.networkId);

      switch (networkId) {
        case NetworkIdEnum.NEAR: {
          const tipsBalanceInfo = {
            server_id: serverId,
            reference_type: 'user',
            reference_id: user.id,
            ft_identifier: 'native',
          };

          await payNearTransactionFee(tipsBalanceInfo, feeInfo.trxFee, currentBalance);
          break;
        }

        case NetworkIdEnum.MYRIAD: {
          checkExtensionInstalled();
          setTipsBalanceInfo({
            serverId,
            referenceType: 'user',
            referenceId: user.id,
            ftIdentifier: 'native',
          });
          break;
        }

        default:
          return;
      }
    } catch (error) {
      setVerifyingRef(false);
      // TODO: Register Translation
      enqueueSnackbar({
        message: error.message,
        variant: 'error',
      });
    }
  };

  const closeAccountList = (verifying?: boolean) => {
    setShowAccountList(false);
    if (typeof verifying === 'boolean' && verifying === true) return;
    setVerifyingRef(false);
  };

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts();
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();

    setAccounts(accounts);
  };

  const handleConnect = async (account?: InjectedAccountWithMeta) => {
    closeAccountList(true);

    if (!account) return;

    setVerifyingRef(true);
    try {
      await payMyriaTransactionFee(
        account,
        currentWallet?.network?.rpcURL ?? '',
        tipsBalanceInfo,
        feeInfo.trxFee,
        success => {
          setClaimingSucces(success);
        },
      );
    } finally {
      setVerifyingRef(false);
      setTipsBalanceInfo(null);
    }
  };

  const getNativeToken = (tips: TipResult[]) => {
    const native = tips.find(tip => tip?.tipsBalanceInfo?.ftIdentifier === 'native');
    if (native) return native.symbol;
    return '';
  };

  const showNetwork = (network: Network) => {
    const tipBalances = tipWithBalances(network);
    const nativeToken = getNativeToken(network?.tips ?? []);

    if (!tipBalances.length) {
      if (!isShow(network)) return;
      switch (network.id) {
        case NetworkIdEnum.MYRIAD:
        case NetworkIdEnum.NEAR:
          return (
            <div style={{marginTop: 20}} key={network.id}>
              <Empty
                title={i18n.t('Wallet.Tip.Empty.Title')}
                subtitle={i18n.t('Wallet.Tip.Empty.Subtitle')}
              />
            </div>
          );
        default:
          return;
      }
    }

    return (
      <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'} key={network.id}>
        {showTip(network, tipBalances, nativeToken)}
      </BoxComponent>
    );
  };

  const showTip = (network: Network, tipBalances: TipResult[], token: string) => {
    if ((claimingAll || verifyingRef) && isShow(network)) return <ShimerComponent />;
    return (
      <Tip
        loading={claiming}
        tips={tipBalances}
        networkId={network.id}
        blockchainPlatform={network.blockchainPlatform}
        currentWallet={currentWallet}
        onClaim={handleClaimTip}
        onClaimAll={handleClaimTipAll}
        onSwitchNetwork={console.log}
        onHandleVerifyRef={handleVerifyReference}
        onSuccess={claimingSuccess}
        balance={amount}
        nativeToken={token}
        txFee={feeInfo.formattedTrxFee}
      />
    );
  };

  return (
    <NoSsr>
      {loading ? (
        <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
          <ShimerComponent />
        </BoxComponent>
      ) : (
        tipsEachNetwork.map(network => showNetwork(network))
      )}
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleConnect}
        onClose={closeAccountList}
      />

      <Backdrop className={styles.backdrop} open={claimingAll || isSignerLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </NoSsr>
  );
};

export default TipContainer;
