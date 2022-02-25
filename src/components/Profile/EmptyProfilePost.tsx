import React from 'react';

import {Empty} from '../atoms/Empty';
import ShowIf from '../common/show-if.component';

type EmptyPostProps = {
  owner: boolean;
};

export const EmptyProfilePost: React.FC<EmptyPostProps> = ({owner}) => {
  return (
    <div style={{marginTop: 30}}>
      <ShowIf condition={owner}>
        <Empty title="Nothing to see here!" subtitle="You haven't posted anything yet." />
      </ShowIf>

      <ShowIf condition={!owner}>
        <Empty title="Nothing to see here!" subtitle="This user hasn't posted anything yet." />;
      </ShowIf>
    </div>
  );
};
