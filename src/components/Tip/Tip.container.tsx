import React from 'react';

import {BoxComponent} from '../atoms/Box';
import {Tip} from './Tip';

import {Empty} from 'src/components/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';
import {useClaimTip} from 'src/hooks/use-claim-tip.hook';

export const TipContainer: React.FC = () => {
  const {loading, tipsEachNetwork} = useClaimTip();

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
              <Tip tips={network.tips} network={network.id} />
            </BoxComponent>
          </ShowIf>
        </>
      ))}
    </>
  );
};

export default TipContainer;
