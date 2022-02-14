import React from 'react';

import {Empty} from '../atoms/Empty';

export const PrivateProfile: React.FC = () => {
  return (
    <div style={{marginTop: '27px'}}>
      <Empty
        title="Nothing to see here!"
        subtitle="This account is private. Send them a friend request to see their full profile."
      />
    </div>
  );
};
