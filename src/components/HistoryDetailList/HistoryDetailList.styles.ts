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
      [theme.breakpoints.down('xs')]: {
        columnGap: theme.spacing(0),
      },
    },
    headerActionWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    headerActionMobile: {
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
    textSenderWrapper: {
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
      },
    },
    textSender: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
        width: '120px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
    },
    textTime: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
      },
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
    textSent: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        color: theme.palette.primary.main,
      },
    },
    textReceived: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        color: theme.status.warning.main,
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
    filterList: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      padding: 0,
      marginTop: 0,
      marginBottom: 20,

      '& .MuiListItem-container': {
        marginBottom: 8,
      },
      '& .MuiListItem-root': {
        height: 36,
        width: 'auto',
        padding: theme.spacing(1, 0),

        [theme.breakpoints.down('md')]: {
          paddingRight: 40,
        },

        '&.Mui-selected': {
          fontWeight: 'bold',
          backgroundColor: alpha('#FFC857', 0.15),

          '&::before,&::after': {
            content: '""',
            position: 'absolute',
            width: 30,
            height: 36,
            top: 0,
            backgroundColor: alpha('#FFC857', 0.15),
          },
          '&::before': {
            left: -30,
          },
          '&::after': {
            right: -30,
          },
        },
      },

      '& .MuiListItemText-root': {
        margin: 0,
      },

      '& .MuiTypography-root': {
        lineHeight: '18px',
      },

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    optionFilterText: {
      '& .MuiTypography-root': {
        marginLeft: 10,
      },
    },
    btnApply: {
      width: '90%',
      position: 'absolute',
      bottom: 74,
    },
    btnReset: {
      width: '90%',
      position: 'absolute',
      bottom: 20,
    },
  }),
);
