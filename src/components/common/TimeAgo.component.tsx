import React from 'react';

import {timeAgo} from 'src/helpers/date';

type TimeAgoProps = {
  date: Date;
};

export const TimeAgo: React.FC<TimeAgoProps> = props => {
  const {date} = props;

  return <span>{timeAgo(date)}</span>;
};
