import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {NoSsr} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {encodeAddress} from '@polkadot/keyring';
import {hexToU8a} from '@polkadot/util';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';

import {PolkadotAccountList} from 'components/PolkadotAccountList';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {utils} from 'near-api-js';
import {Empty} from 'src/components/atoms/Empty';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {Network, NetworkIdEnum, TipResult} from 'src/interfaces/network';
import {updateTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import {getServerId} from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const {publicRuntimeConfig} = getConfig();

export const TipContainer: React.FC = () => {
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();

  const {currentWallet, user} = useSelector<RootState, UserState>(state => state.userState);
  const {payTransactionFee} = useNearApi();
  const {getClaimFeeReferenceMyria} = usePolkadotApi();
  const {loading, claiming, claimingAll, tipsEachNetwork, claim, claimAll, trxFee} = useClaimTip();
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const [verifyingRef, setVerifyingRef] = useState(false);
  const [claimingSuccess, setClaimingSucces] = useState(false);
  const [showAccountList, setShowAccountList] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

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

      setVerifyingRef(true);

      const tippingContractId = publicRuntimeConfig.nearTippingContractId;
      WalletAPI.claimReference({txFee, tippingContractId})
        .then(() => {
          enqueueSnackbar({
            // TODO: Register Translation
            message: 'Verifying Success',
            variant: 'success',
          });
        })
        .catch(e => {
          success = false;
          enqueueSnackbar({
            // TODO: Register Translation
            message: e.message,
            variant: 'error',
          });
        })
        .finally(() => {
          setClaimingSucces(success);
          setVerifyingRef(false);
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
      switch (networkId) {
        case NetworkIdEnum.NEAR: {
          const serverId = await getServerId(currentWallet?.networkId);
          const tipsBalanceInfo = {
            server_id: serverId,
            reference_type: 'user',
            reference_id: user.id,
            ft_identifier: 'native',
          };

          const amountInYocto = utils.format.parseNearAmount(trxFee);

          await payTransactionFee(tipsBalanceInfo, amountInYocto, currentBalance);
          break;
        }

        case NetworkIdEnum.MYRIAD: {
          checkExtensionInstalled();
          break;
        }

        default:
          return;
      }
    } catch (error) {
      // TODO: Register Translation
      enqueueSnackbar({
        message: error.message,
        variant: 'error',
      });
    }
  };

  const closeAccountList = () => {
    setShowAccountList(false);
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
    const encodeAccount = encodeAddress(hexToU8a(currentWallet.id));
    const currentAccounts = accounts.filter(account => account.address === encodeAccount);

    setAccounts(currentAccounts);
  };

  const handleConnect = async (account?: InjectedAccountWithMeta) => {
    closeAccountList();

    if (!account) return;

    setVerifyingRef(false);
    //TODO: myr-2286
    const data = await getClaimFeeReferenceMyria(trxFee);

    console.log('data >>>', data);

    //  WalletAPI.claimReference({txFee, tippingContractId})
    // verified &&
    //   account &&
    //   enqueueSnackbar({
    //     message: i18n.t('Wallet.Manage.Alert.Connect'),
    //     variant: 'success',
    //   });

    // !verified &&
    //   account &&
    //   enqueueSnackbar({
    //     message: i18n.t('Wallet.Manage.Alert.Error'),
    //     variant: 'error',
    //   });

    return;
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
            <div style={{marginTop: 20}}>
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
      <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
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
        currentWallet={currentWallet}
        onClaim={handleClaimTip}
        onClaimAll={handleClaimTipAll}
        onHandleVerifyRef={handleVerifyReference}
        onSuccess={claimingSuccess}
        balance={amount}
        nativeToken={token}
        txFee={trxFee}
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
    </NoSsr>
  );
};

export default TipContainer;
