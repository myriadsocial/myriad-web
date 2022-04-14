import React from 'react';
import {useSelector} from 'react-redux';

import {BoxComponent} from '../atoms/Box';
import {ShimerComponent} from './Shimer';
import {Tip} from './Tip';

import {Empty} from 'src/components/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Network} from 'src/interfaces/wallet';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const TipContainer: React.FC = () => {
  const {currentWallet} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {loading, tipsEachNetwork, claimTipMyria, claimAll} = useClaimTip();
  const {openToasterSnack} = useToasterSnackHook();

  const handleClaimTip = (networkId: string, ftIdentifier: string) => {
    const isNative = ftIdentifier === 'native';
    const balanceGasClaim = balanceDetails.filter(
      ar => ar.native === isNative && ar.networkId === networkId,
    );
    if (balanceGasClaim.length > 0) {
      //TODO: get estimate fee gas from polkadot
      if (balanceGasClaim[0].originBalance < 1) {
        openToasterSnack({
          message: 'Insufficient balance',
          variant: 'warning',
        });
      } else {
        claimTipMyria(networkId, ftIdentifier, () => {
          openToasterSnack({
            message: 'Tips will be add to your wallet shortly.',
            variant: 'success',
          });
        });
      }
    }
  };

  const handleClaimTipAll = (networkId: string) => {
    claimAll(networkId, () => {
      openToasterSnack({
        message: 'Tips will be add to your wallet shortly.',
        variant: 'success',
      });
    });
  };

  const tipWithBalances = (network: Network) => {
    return network.tips.filter(tip => tip.amount !== '0');
  };

  const isShow = (network: Network) => {
    if (network.id === currentWallet?.network) return true;
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
                title="You have no tip"
                subtitle="Start to make a post to get tips from other users."
              />
            </div>
          </ShowIf>
          <ShowIf condition={!loading && !!tipWithBalances(network).length}>
            <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
              <Tip
                tips={tipWithBalances(network)}
                network={network.id}
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
