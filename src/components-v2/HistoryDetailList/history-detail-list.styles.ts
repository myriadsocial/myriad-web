import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: 0,
    },
    tableRow: {
      '& .MuiTableCell-root': {
        borderBottom: 'none',
        paddingRight: 0,
      },
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
    },
    tableCell: {
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
      justifyContent: 'flex-start',
      alignItems: 'center',
      columnGap: theme.spacing(3.875),
      marginTop: theme.spacing(2.5),
    },
    currencyDetailWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      columnGap: theme.spacing(1.5),
    },
    leftJustifiedWrapper: {
      marginLeft: 'auto',
      display: 'flex',
      columnGap: theme.spacing(4.375),
    },
    tipStatusGreen: {
      width: 80,
      height: 24,
      borderRadius: 2,
      background: theme.status.success.surface,
      '& .MuiTypography-root': {
        color: theme.status.success.pressed,
        fontWeight: 'bold',
      },
    },
    tipStatusRed: {
      width: 80,
      height: 24,
      borderRadius: 2,
      background: theme.status.danger.surface,
      '& .MuiTypography-root': {
        color: theme.status.danger.pressed,
        fontWeight: 'bold',
      },
    },
    textAmountGreen: {
      fontWeight: 'bold',
      color: theme.status.success.main,
    },
    textAmountRed: {
      fontWeight: 'bold',
      color: theme.status.danger.main,
    },
  }),
);
