import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MetricProps} from './Metric';

export const useStyles = makeStyles<Theme, MetricProps>(theme =>
  createStyles({
    root: {},
    username: {
      fontWeight: 400,
      lineHeight: '17.57px',
      [theme.breakpoints.down('xs')]: {
        color: props => (props.profile ? '#FFFFFF' : '#616161'),
        fontSize: 12,
      },
    },
    total: {
      fontWeight: 700,
      fontSize: 16,
      lineHeight: '20.08px',

      [theme.breakpoints.down('xs')]: {
        fontWeight: 500,
        fontSize: 16,
      },
    },
  }),
);
