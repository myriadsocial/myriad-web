import React from 'react';
import {useSelector} from 'react-redux';

import {BoxComponent} from '../atoms/Box';
import {Tip} from './Tip';

import {Empty} from 'src/components/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const TipContainer: React.FC = () => {
  const {currentWallet} = useSelector<RootState, UserState>(state => state.userState);
  const {loading, tipsEachNetwork, claimTipMyria, claimAll} = useClaimTip();
  const {openToasterSnack} = useToasterSnackHook();

  const handleClaimTip = (networkId: string, ftIdentifier: string) => {
    claimTipMyria(networkId, ftIdentifier, () => {
      openToasterSnack({
        message: 'Tips will be add to your wallet shortly.',
        variant: 'success',
      });
    });
    console.log(networkId, ftIdentifier);
  };

  const handleClaimTipAll = (networkId: string) => {
    claimAll(networkId, () => {
      openToasterSnack({
        message: 'Tips will be add to your wallet shortly.',
        variant: 'success',
      });
    });
  };

  return (
    <>
      {tipsEachNetwork.map(network => (
        <>
          <ShowIf condition={loading}>
            <div style={{marginTop: 20}}>
              <Empty title="loading" subtitle="loading" />
            </div>
          </ShowIf>
          <ShowIf condition={!loading && !network.tips.length}>
            <div style={{marginTop: 20}}>
              <Empty
                title="You have no tip"
                subtitle="Start to make a post to get tips from other users."
              />
            </div>
          </ShowIf>
          <ShowIf condition={!loading && !!network.tips.length}>
            <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
              <Tip
                tips={network.tips}
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
