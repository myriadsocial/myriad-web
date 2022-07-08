import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';
import {TipNear} from './TipNear';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Empty} from 'src/components/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {Network, NetworkIdEnum, TipResult} from 'src/interfaces/network';
import {claimReference} from 'src/lib/api/claim-reference';
import {getServerId} from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const TipContainer: React.FC = () => {
  const router = useRouter();
  const {publicRuntimeConfig} = getConfig();
  const {currentWallet, user} = useSelector<RootState, UserState>(state => state.userState);
  const {payTransactionFee} = useNearApi();
  const {loading, claiming, claimingAll, tipsEachNetwork, claim, claimAll, getTip} = useClaimTip();
  const enqueueSnackbar = useEnqueueSnackbar();
  const transactionHashes = router.query.transactionHashes as string | null;
  const errorCode = router.query.errorCode as string | null;
  const errorMessage = router.query.errorMessage as string | null;
  const txFee = router.query.txFee as string | null;

  useEffect(() => {
    if (!txFee && transactionHashes) {
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

    if (txFee && !errorCode && !errorMessage) {
      claimReferenceFunction()
        .then(() => {
          enqueueSnackbar({
            // TODO: Register Translation
            message: 'Verifying Success',
            variant: 'success',
          });
          return getTip();
        })
        .catch(e => {
          enqueueSnackbar({
            // TODO: Register Translation
            message: e.message,
            variant: 'error',
          });
          return getTip();
        });
    }

    const url = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

    url.search = '';
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

  const handleVerifyReference = async () => {
    if (!currentWallet?.networkId) return;
    if (!user?.id) return;

    try {
      const serverId = await getServerId(currentWallet?.networkId);
      const txFee = await payTransactionFee({
        referenceId: user?.id,
        serverId,
      });
      await claimReference({
        tippingContractId: publicRuntimeConfig.nearTippingContractId,
        txFee,
      });
    } catch (error) {
      // TODO: Register Translation
      enqueueSnackbar({
        message: error.message,
        variant: 'error',
      });
    } finally {
      getTip();
    }
  };

  const isShowVerifyReference = (tips: TipResult[], networkId: string) => {
    if (networkId !== NetworkIdEnum.NEAR) return false;
    const tip = tips.find(e => e.accountId === null);
    if (tip) return true;
    return false;
  };

  const claimReferenceFunction = async () => {
    await claimReference({
      tippingContractId: publicRuntimeConfig.nearTippingContractId,
      txFee,
    });
  };

  return (
    <>
      {tipsEachNetwork.map(network => (
        <>
          <ShowIf condition={loading}>
            <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
              <ShimerComponent />
            </BoxComponent>
          </ShowIf>
          <ShowIf condition={!loading && !tipWithBalances(network).length && isShow(network)}>
            <div style={{marginTop: 20}}>
              <Empty
                title={i18n.t('Wallet.Tip.Empty.Title')}
                subtitle={i18n.t('Wallet.Tip.Empty.Subtitle')}
              />
            </div>
          </ShowIf>
          <ShowIf condition={!loading && !!tipWithBalances(network).length}>
            <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
              <ShowIf condition={claimingAll}>
                {isShow(network) ? (
                  <ShimerComponent />
                ) : (
                  <Tip
                    loading={claiming}
                    tips={tipWithBalances(network)}
                    networkId={network.id}
                    currentWallet={currentWallet}
                    onClaim={handleClaimTip}
                    onClaimAll={handleClaimTipAll}
                  />
                )}
              </ShowIf>
              <ShowIf condition={!claimingAll && !isShow(network)}>
                <Tip
                  loading={claiming}
                  tips={tipWithBalances(network)}
                  networkId={network.id}
                  currentWallet={currentWallet}
                  onClaim={handleClaimTip}
                  onClaimAll={handleClaimTipAll}
                />
              </ShowIf>
              <ShowIf condition={!claimingAll && isShow(network)}>
                {isShowVerifyReference(network.tips, network.id) ? (
                  <>
                    <TipNear
                      handleVerifyReference={handleVerifyReference}
                      totalTipsData={network.tips}
                      handleClaimAll={console.log}
                    />
                  </>
                ) : (
                  <>
                    <Tip
                      loading={claiming}
                      tips={tipWithBalances(network)}
                      networkId={network.id}
                      currentWallet={currentWallet}
                      onClaim={handleClaimTip}
                      onClaimAll={handleClaimTipAll}
                    />
                  </>
                )}
              </ShowIf>
            </BoxComponent>
          </ShowIf>
        </>
      ))}
    </>
  );
};

export default TipContainer;
