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
import {Network, NetworkIdEnum} from 'src/interfaces/network';
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
  const {loading, claiming, claimingAll, tipsEachNetwork, claim, claimAll} = useClaimTip();
  const enqueueSnackbar = useEnqueueSnackbar();
  const transactionHashes = router.query.transactionHashes as string | null;
  const errorCode = router.query.errorCode as string | null;
  const errorMessage = router.query.errorMessage as string | null;
  const txFee = router.query.txFee as string | null;

  useEffect(() => {
    if (transactionHashes) {
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

    if (txFee) {
      claimReferenceFunction().catch(e => console.log('error', e));
    }

    const url = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

    url.search = '';
    router.replace(url, undefined, {shallow: true});
  }, [errorCode, transactionHashes, errorMessage, txFee]);

  useEffect(() => {
    isShowVerifyReference();
  }, [tipsEachNetwork]);

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
    const dataServerId = await getServerId(currentWallet?.networkId);

    const dataTransactionFee = await payTransactionFee({
      referenceId: user?.id,
      serverId: dataServerId,
    });
    const data = await claimReference({
      tippingContractId: publicRuntimeConfig.nearTippingContractId,
      txFee: dataTransactionFee,
    });

    console.log('data', data);
  };

  const handleClaimAll = () => {
    return undefined;
  };

  const totalTipsData = tipsEachNetwork
    .filter(item => item.chainId === 'testnet')
    .map(item => {
      return item.tips;
    });

  const isShowVerifyReference = () => {
    if (totalTipsData[0].find(item => item.accountId === null && item.amount !== '0.000'))
      return true;
    return false;
  };

  const claimReferenceFunction = async () => {
    await claimReference({
      tippingContractId: publicRuntimeConfig.nearTippingContractId,
      txFee: txFee,
    });
  };

  //ketika belum verify yan gbawah g muncul, loading, error message/ handling sebelum url dikosongkan lgi

  return (
    <>
      <ShowIf condition={isShowVerifyReference()}>
        <BoxComponent isWithChevronRightIcon={false} marginTop={'30px'}>
          <TipNear
            handleVerifyReference={handleVerifyReference}
            totalTipsData={totalTipsData[0]}
            handleClaimAll={handleClaimAll}
          />
        </BoxComponent>
      </ShowIf>
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
          <ShowIf condition={!!tipWithBalances(network).length && !isShowVerifyReference}>
            <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
              <ShowIf condition={claimingAll}>
                <ShowIf condition={isShow(network)}>
                  <ShimerComponent />
                </ShowIf>
                <ShowIf condition={!isShow(network)}>
                  <Tip
                    loading={claiming}
                    tips={tipWithBalances(network)}
                    networkId={network.id}
                    currentWallet={currentWallet}
                    onClaim={handleClaimTip}
                    onClaimAll={handleClaimTipAll}
                  />
                </ShowIf>
              </ShowIf>
              <ShowIf condition={!claimingAll}>
                <Tip
                  loading={claiming}
                  tips={tipWithBalances(network)}
                  networkId={network.id}
                  currentWallet={currentWallet}
                  onClaim={handleClaimTip}
                  onClaimAll={handleClaimTipAll}
                />
              </ShowIf>
            </BoxComponent>
          </ShowIf>
        </>
      ))}
    </>
  );
};

export default TipContainer;
