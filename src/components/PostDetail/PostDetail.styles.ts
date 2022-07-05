import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 10,
      width: 644,
      marginBottom: 12,

      [theme.breakpoints.down('md')]: {
        width: 590,
      },

      [theme.breakpoints.down('xs')]: {
        maxWidth: 0,
      },
    },
    content: {
      padding: '0 20px',
      wordBreak: 'break-word',
      width: 644,

      [theme.breakpoints.down('md')]: {
        width: 590,
      },
    },
    tags: {
      marginBottom: theme.spacing(1.5),
    },
    action: {
      marginTop: 10,
      padding: '0 20px 20px',
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);
