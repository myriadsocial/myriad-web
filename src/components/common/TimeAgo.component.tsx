import React from 'react';

import {formatDistance, subDays} from 'date-fns';

type TimeAgoProps = {
  date: Date;
};

export const TimeAgo: React.FC<TimeAgoProps> = props => {
  const {date} = props;

  const formatted = formatDistance(subDays(new Date(date), 0), new Date(), {
    addSuffix: true,
  });

  return <span>{formatted}</span>;
};
