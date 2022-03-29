import React from 'react';

import {BoxComponent} from '../atoms/Box';
import {Tip} from './Tip';

import {Empty} from 'src/components/atoms/Empty';
import ShowIf from 'src/components/common/show-if.component';

export const TipContainer: React.FC = () => {
  return (
    <>
      {/* TODO WIRING CLAIM */}
      <ShowIf condition={true}>
        <div style={{marginTop: 20}}>
          <Empty
            title="You have no tip"
            subtitle="Start to make a post to get tips from other users."
          />
        </div>
      </ShowIf>
      {/* MAPING ARRAY OF DATA CLAIM */}
      <ShowIf condition={true}>
        <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
          <Tip />
        </BoxComponent>
      </ShowIf>
    </>
  );
};

export default TipContainer;
