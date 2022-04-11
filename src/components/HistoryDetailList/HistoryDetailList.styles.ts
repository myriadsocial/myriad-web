import {createStyles, Theme, makeStyles, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: 0,
    },
    infiniteScroll: {
      width: '100%',
    },
    tableRow: {
      position: 'relative',

      '& .MuiTableCell-root': {
        borderBottom: 'none',
        paddingRight: 0,
        width: '100%',
      },
      '&:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
      display: 'flex',
      alignItems: 'center',
    },
    tableCell: {
      '& .MuiTableCell-root': {
        borderBottom: 'none',
        paddingRight: 0,
        width: '100%',
      },
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      columnGap: theme.spacing(2.5),
      borderBottom: 'none',
      paddingLeft: 0,
      paddingRight: 0,
    },
    headerActionWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    currencyDetailWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      columnGap: theme.spacing(1.5),
    },
    sent: {
      width: 80,
      height: 24,
      borderRadius: 10,
      marginLeft: theme.spacing(6),
      background: theme.status.primary.surface,
      '& .MuiTypography-root': {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
      },
    },
    received: {
      width: 80,
      height: 24,
      borderRadius: 10,
      marginLeft: theme.spacing(6),
      background: theme.status.warning.surface,
      '& .MuiTypography-root': {
        color: theme.status.warning.pressed,
        fontWeight: 'bold',
      },
    },
    textAmountReceived: {
      fontWeight: 'bold',
      color: theme.status.warning.main,
    },
    textAmountSent: {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 360,
    },
  }),
);
