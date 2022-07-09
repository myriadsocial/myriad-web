import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';
import {TipNear} from './TipNear';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Empty} from 'src/components/atoms/Empty';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {Network, NetworkIdEnum, TipResult} from 'src/interfaces/network';
import {updateTransaction} from 'src/lib/api/transaction';
import {getServerId} from 'src/lib/api/wallet';
import * as WalletAPI from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const TipContainer: React.FC = () => {
  const router = useRouter();
  const {publicRuntimeConfig} = getConfig();
  const {currentWallet, user} = useSelector<RootState, UserState>(state => state.userState);
  const {payTransactionFee} = useNearApi();
  const {loading, claiming, claimingAll, tipsEachNetwork, claim, claimAll} = useClaimTip();
  const enqueueSnackbar = useEnqueueSnackbar();
  const transactionHashes = router.query.transactionHashes as string | null;
  const errorCode = router.query.errorCode as string | null;
  const errorMessage = router.query.errorMessage as string | null;
  const txFee = router.query.txFee as string | null;
  const amount = router.query.balance as string | null;
  const txInfo = router.query.txInfo as string | null;
  const {nearTippingContractId: tippingContractId} = publicRuntimeConfig;
  const [verifyingRef, setVerifyingRef] = useState(false);
  const [claimingSuccess, setClaimingSucces] = useState(false);

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
  }, [errorCode, transactionHashes, errorMessage, txFee]);

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

  const handleVerifyReference = async (currentBalance: string | number) => {
    if (!currentWallet?.networkId) return;
    if (!user?.id) return;

    setVerifyingRef(true);

    try {
      const serverId = await getServerId(currentWallet?.networkId);

      await payTransactionFee(serverId, user?.id, currentBalance);
    } catch (error) {
      // TODO: Register Translation
      enqueueSnackbar({
        message: error.message,
        variant: 'error',
      });
    } finally {
      setVerifyingRef(false);
    }
  };

  const isShowVerifyReference = (tips: TipResult[], networkId: string) => {
    if (networkId !== NetworkIdEnum.NEAR) return false;
    const tip = tips.find(e => e.accountId === null);
    if (tip) return true;
    return false;
  };

  const showNetwork = (network: Network) => {
    const tipBalances = tipWithBalances(network);

    if (!tipBalances.length) {
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
        {showTip(network, tipBalances)}
      </BoxComponent>
    );
  };

  const showTip = (network: Network, tipBalances: TipResult[]) => {
    if (claimingAll) {
      if (isShow(network)) return <ShimerComponent />;
      return (
        <Tip
          loading={claiming}
          tips={tipBalances}
          networkId={network.id}
          currentWallet={currentWallet}
          onClaim={handleClaimTip}
          onClaimAll={handleClaimTipAll}
        />
      );
    }

    if (!isShow(network)) {
      return (
        <Tip
          loading={claiming}
          tips={tipBalances}
          networkId={network.id}
          currentWallet={currentWallet}
          onClaim={handleClaimTip}
          onClaimAll={handleClaimTipAll}
        />
      );
    }

    if (verifyingRef) {
      if (isShow(network)) return <ShimerComponent />;
      return (
        <Tip
          loading={claiming}
          tips={tipBalances}
          networkId={network.id}
          currentWallet={currentWallet}
          onClaim={handleClaimTip}
          onClaimAll={handleClaimTipAll}
        />
      );
    }

    const showVerifyReference = isShowVerifyReference(tipBalances, network.id);

    if (showVerifyReference) {
      if (!claimingSuccess) {
        return (
          <TipNear
            handleVerifyReference={handleVerifyReference}
            totalTipsData={network.tips}
            handleClaimAll={console.log}
          />
        );
      }

      return (
        <Tip
          loading={claiming}
          tips={tipBalances}
          networkId={network.id}
          currentWallet={currentWallet}
          onClaim={handleClaimTip}
          onClaimAll={handleClaimTipAll}
          onSuccess={claimingSuccess}
          balance={amount}
        />
      );
    }

    return (
      <Tip
        loading={claiming}
        tips={tipBalances}
        networkId={network.id}
        currentWallet={currentWallet}
        onClaim={handleClaimTip}
        onClaimAll={handleClaimTipAll}
      />
    );
  };

  return (
    <>
      {loading ? (
        <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
          <ShimerComponent />
        </BoxComponent>
      ) : (
        tipsEachNetwork.map(network => showNetwork(network))
      )}
    </>
  );
};

export default TipContainer;
