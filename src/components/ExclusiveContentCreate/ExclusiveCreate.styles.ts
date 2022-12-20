import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    tabs: {
      minHeight: 30,
      marginLeft: -30,
      marginRight: -30,
      borderBottom: '1px solid #E5E5E5',

      [theme.breakpoints.down('xs')]: {
        marginLeft: -20,
        marginRight: -20,
      },

      '& .MuiTabs-flexContainer': {
        justifyContent: 'space-evenly',
      },

      '& .MuiTab-wrapper': {
        textTransform: 'capitalize',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: '20px',
        maxWidth: 90,
        minWidth: 90,
      },

      '& .MuiTab-root': {
        minHeight: 30,
        maxWidth: 90,
        minWidth: 90,
      },

      '& .MuiTab-textColorInherit.Mui-selected': {
        fontWeight: 700,
      },
    },
    action: {
      padding: 30,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 0,
      },
    },
    option: {
      display: 'flex',
      alignItems: 'center',

      [theme.breakpoints.down('xs')]: {
        marginLeft: 20,
      },
    },
    markdown: {
      width: 120,
    },
    removePeople: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    people: {},
    preview: {
      marginBottom: 30,

      '& .MuiListItem-root:hover': {
        backgroundColor: alpha('#FFC857', 0.15),

        '&::before,&::after': {
          content: '""',
          position: 'absolute',
          width: 30,
          height: '100%',
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
    header: {
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '6px 16px',
    },
    tokenColumn: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    text: {
      fontWeight: 400,
      fontSize: '12px',
      marginRight: 10,
    },
    input: {
      width: '160px',
      height: '32px',
      border: 'solid grey 1px',
      borderRadius: '20px',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      marginTop: '6px',
    },
    hover: {
      '&:hover': {
        backgroundColor: 'rgba(255, 200, 87, 0.15)',
      },
    },
    fill: {
      fill: 'currentColor',
    },
    usd: {
      color: '#404040',
      fontSize: '12px',
    },
    icon: {
      width: 17,
      height: 17,
      transform: 'rotate(180deg)',
    },
    currencyWrapper: {
      display: 'flex',
      width: '100%',
      columnGap: 10,
      marginBottom: 26,
    },
    feeWrapper: {
      display: 'flex',
      alignItems: 'center',
      columnGap: 5,
    },
  }),
);
