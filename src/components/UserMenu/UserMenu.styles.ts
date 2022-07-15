import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 644,
      background: 'transparent',
      '& .MuiTab-root': {
        height: 36,
      },
      '& .MuiBox-root': {
        paddingTop: 0,
      },

      [theme.breakpoints.down('md')]: {
        minWidth: 590,
      },
      [theme.breakpoints.down('xs')]: {
        minWidth: 0,
        width: '100%',
      },
    },
  }),
);
