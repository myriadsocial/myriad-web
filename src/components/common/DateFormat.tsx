import React from 'react';

import Typography from '@material-ui/core/Typography';

import {timeAgo} from '../../helpers/date';

import {differenceInDays, format} from 'date-fns';

type DateFormatProps = {
  date: string | Date;
  dateFormat?: string;
  max?: number;
};

const DateFormat: React.FC<DateFormatProps> = ({date, dateFormat = 'dd MMMM yyyy', max = 3}) => {
  const diff = differenceInDays(new Date(), new Date(date));

  return (
    <Typography variant="body2" color="textSecondary" component="span">
      {diff <= max ? timeAgo(new Date(date)) : format(new Date(date), dateFormat)}
    </Typography>
  );
};

export default DateFormat;
