import React from 'react';

import Typography from '@material-ui/core/Typography';

import {format} from 'date-fns';

type Props = {
  date: string | Date;
  dateFormat?: string;
};

const DateFormat = ({date, dateFormat = 'dd MMMM yyyy'}: Props) => {
  return (
    <Typography variant="body2" color="textSecondary" component="span">
      {format(new Date(date), dateFormat)}
    </Typography>
  );
};

export default DateFormat;
