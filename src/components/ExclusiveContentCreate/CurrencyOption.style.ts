import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    walletButton: {
      width: '152px',
      background: '#FFF',
      fontSize: '14px',
      fontWeight: 400,
      border: '1px solid #C2C2C2',
      borderRadius: 6,
    },
    menu: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: 8,
        height: 40.99,
        borderRadius: theme.spacing(0, 1.25, 1.25, 0),
        background: theme.palette.primary.main,
      },
    },
    currencyIcon: {
      borderRadius: '100%',
    },
    placeholder: {
      fontSize: '12px !important',
      color: '#616161',
    },
  }),
);
