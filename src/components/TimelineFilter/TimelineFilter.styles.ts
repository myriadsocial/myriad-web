import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {TimelineFilterProps} from './TimelineFilter';

export const useStyles = makeStyles<Theme, TimelineFilterProps>(theme =>
  createStyles({
    root: {
      justifyContent: 'space-between',
      [theme.breakpoints.down('xs')]: {
        justifyContent: props => (props.filterType === 'origin' ? 'flex-end' : 'space-between'),
      },
    },
    mobile: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    tabs: {
      '& .MuiTabs-flexContainer': {
        gap: 20,
        [theme.breakpoints.down('xs')]: {
          gap: 8,
        },
      },
    },
  }),
);
