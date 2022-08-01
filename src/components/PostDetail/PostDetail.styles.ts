import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 10,
      minWidth: 644,
      marginBottom: 12,

      [theme.breakpoints.down('md')]: {
        minWidth: 590,
      },

      [theme.breakpoints.down('xs')]: {
        minWidth: 0,
      },
    },
    wrapper: {
      padding: 4,
    },
    content: {
      wordBreak: 'break-word',
      padding: '0 16px',
      marginBottom: 16,
    },
    tags: {
      marginBottom: theme.spacing(1.5),
    },
    action: {
      padding: '0 16px 16px',
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);
