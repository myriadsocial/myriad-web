import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxSizing: 'border-box',
      padding: '30px',
      paddingBottom: '20px',
    },
    mb20: {
      marginBottom: '20px',
    },
  }),
);
