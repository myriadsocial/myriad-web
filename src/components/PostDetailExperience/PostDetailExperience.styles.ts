import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 10,
      width: '100%',
      marginBottom: 12,

      [theme.breakpoints.down('md')]: {
        minWidth: '100%',
      },

      [theme.breakpoints.down('xs')]: {
        minWidth: 0,
      },
    },
    content: {
      padding: '0 20px 10px',
      wordBreak: 'break-word',
    },
    action: {
      marginTop: 10,
      padding: '0 20px 20px',
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);
