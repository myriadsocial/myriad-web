import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 508,
      padding: 30,
      background: '#FFFFFF',
      borderRadius: 10,
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      [theme.breakpoints.down('md')]: {
        padding: 25,
        width: 490,
      },
    },
    wrapper: {
      marginBottom: 8,
      [theme.breakpoints.down('md')]: {
        marginBottom: 4,
      },
    },
    title: {
      marginBottom: 8,
      '& .MuiTypography-h5': {
        fontWeight: 600,
        color: '#0A0A0A',
      },
      [theme.breakpoints.down('md')]: {
        marginBottom: 4,
      },
    },
    titlePrimary: {
      color: theme.palette.primary.main,
    },
    list: {
      display: 'flex',
      boxSizing: 'border-box',

      '& .MuiListItem-root': {
        display: 'block',
        boxSizing: 'border-box',
        paddingLeft: 2,
        paddingRight: 2,
      },
      '& .Mui-selected': {
        border: '1px solid #6E3FC3',
        borderRadius: 10,
        backgroundColor: 'inherit',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 1,
        paddingRight: 1,
        [theme.breakpoints.down('md')]: {
          paddingTop: 5,
          paddingBottom: 5,
        },
      },
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
      cursor: 'pointer',
      [theme.breakpoints.down('md')]: {
        padding: 5,
      },
    },
    walletCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
      cursor: 'pointer',
      [theme.breakpoints.down('md')]: {
        padding: 5,
      },
    },
    walletCardDisabled: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0)',
    },
    icon: {
      width: 80,
      fontSize: 32,
      marginBottom: 8,
      [theme.breakpoints.down('md')]: {
        width: 60,
        fontSize: 26,
      },
    },
    condition: {
      padding: theme.spacing(2, 0),
    },
    termControl: {
      marginBottom: 24,
      [theme.breakpoints.down('md')]: {
        marginBottom: 16,
      },
    },
    termCondition: {
      color: '#0A0A0A',
    },
    term: {
      fontWeight: 400,
      textDecoration: 'none',
    },
    checkbox: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    mobileRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mobileCard: {
      minWidth: '80vw',
      padding: 20,
      gap: 24,

      /* Neutral/10 */
      background: '#FFFFFF',

      /* Drop Shadow Card */
      boxShadow: `0px 6px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,

      /* Inside auto layout */
      flex: 'none',
      order: 1,
      flexGrow: 0,
    },
    logoWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '10vh',
      marginBottom: 20,
      rowGap: 8,
    },
    logo: {
      height: 48,
    },
    rowCard: {
      display: 'flex',
      alignItems: 'center',
      padding: 10,
      cursor: 'pointer',
    },
    rowCardIcon: {
      width: 80,
      fontSize: 32,
    },
    actionWrapper: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
    },
  }),
);
