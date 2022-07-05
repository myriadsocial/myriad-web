import React from 'react';
import {useSelector} from 'react-redux';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Empty} from 'src/components/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {Network} from 'src/interfaces/network';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const TipContainer: React.FC = () => {
  const {currentWallet} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {loading, claiming, tipsEachNetwork, claim, claimAll} = useClaimTip();
  const enqueueSnackbar = useEnqueueSnackbar();

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
