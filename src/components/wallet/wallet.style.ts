import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
    button: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white,
      borderRadius: 15,
    },
    walletActions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(0.25),
    },
  }),
);
