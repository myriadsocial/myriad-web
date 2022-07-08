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
import {Network} from 'src/interfaces/network';
import {claimReference} from 'src/lib/api/claim-reference';
import {getServerId} from 'src/lib/api/wallet';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const TipContainer: React.FC = () => {
  const router = useRouter();
  const {currentWallet, user} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {loading, claiming, tipsEachNetwork, claim, claimAll} = useClaimTip();
  const {payTransactionFee} = useNearApi();
  const enqueueSnackbar = useEnqueueSnackbar();

  const transactionHashes = router.query.transactionHashes as string | null;
  const errorCode = router.query.errorCode as string | null;
  const errorMessage = router.query.errorMessage as string | null;
  const txFee = router.query.txFee as string | null;

  const {publicRuntimeConfig} = getConfig();

  const handleClaimTip = (networkId: string, ftIdentifier: string) => {
    const isNative = ftIdentifier === 'native';
    const balanceGasClaim = balanceDetails.filter(
      ar => ar.native === isNative && ar.networkId === networkId,
    );
    if (balanceGasClaim.length > 0) {
      //TODO: get estimate fee gas from polkadot
      if (balanceGasClaim[0].originBalance < 1) {
        enqueueSnackbar({
          message: i18n.t('Wallet.Tip.Alert.Insufficient'),
          variant: 'warning',
        });
      } else {
        claim(networkId, ftIdentifier, () => {
          enqueueSnackbar({
            message: i18n.t('Wallet.Tip.Alert.Success'),
            variant: 'success',
          });
        });
      }
    }
  };

  const handleClaimTipAll = (networkId: string) => {
    claimAll(networkId, () => {
      enqueueSnackbar({
        message: i18n.t('Wallet.Tip.Alert.Success'),
        variant: 'success',
      });
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
    //to handling error
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

  useEffect(() => {
    if (txFee) {
      claimReferenceFunction().catch(e => console.log('error', e));
    }

    const url = new URL(router.asPath, publicRuntimeConfig.appAuthURL);

    url.search = '';
    router.replace(url, undefined, {shallow: true});
  }, [transactionHashes, errorCode, errorMessage, txFee]);

  useEffect(() => {
    isShowVerifyReference();
  }, [tipsEachNetwork]);

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
          <ShowIf
            condition={!loading && !!tipWithBalances(network).length && !isShowVerifyReference}>
            <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
              <Tip
                loading={claiming}
                tips={tipWithBalances(network)}
                networkId={network.id}
                currentWallet={currentWallet}
                onClaim={handleClaimTip}
                onClaimAll={handleClaimTipAll}
              />
            </BoxComponent>
          </ShowIf>
        </>
      ))}
    </>
  );
};

export default TipContainer;
