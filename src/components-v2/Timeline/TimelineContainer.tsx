import React from 'react';

import {Timeline as TimelineComponent} from '.';
import {Timeline} from './Timeline.stories';

export const TimelineContainer: React.FC = () => {
  return (
    <TimelineComponent
      posts={Timeline.args?.posts ?? []}
      anonymous={Timeline.args?.anonymous ?? false}
    />
  );
};
