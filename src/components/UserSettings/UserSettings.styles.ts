import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.paper,
      borderRadius: 10,
      marginTop: 27,
      padding: theme.spacing(2.5, 3.75, 3),

      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    title: {
      fontWeight: 700,
      marginBottom: 12,
    },
    name: {
      marginBottom: 12,
      marginTop: 12,
    },
    account: {
      display: 'flex',
      flexDirection: 'column',
    },
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    input: {
      marginTop: theme.spacing(1),
      marginBottom: '0px',
      '& .MuiOutlinedInput-input': {
        padding: '12px 16px',
      },
    },
  }),
);
