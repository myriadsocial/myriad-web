import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    tabsComponent: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    mobile: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
      },
    },
  }),
);
