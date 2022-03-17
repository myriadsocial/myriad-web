import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 30,
      background: '#FFF',
      borderRadius: 10,
    },
    avatar: {
      width: '100px',
      height: '100px',
    },
    photo: {
      width: '48px',
      height: '48px',
      marginRight: '20px',
    },
    experienceTopSummary: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
    },
    experienceSummary: {
      marginLeft: '24px',
    },
    experienceName: {
      fontSize: '18px',
      fontWeight: 700,
      wordBreak: 'break-all',
      lineHeight: '25.2px',
      marginBottom: '8px'
    },
    experienceCounterMetric: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    wrapperCounter:{
      display: 'flex',
      marginRight: '8px'
    },
    counterNumberMetric: {
      fontWeight: 600,
    },
    counterTextMetric: {
      fontWeight: 400,
      color: '#757575'
    },
    subtitle: {
      fontSize: '16px',
      fontWeight: 600,
      marginBottom: '12px',
    },
    tagSection: {
      fontSize: '14px',
      fontWeight: 400,
      marginTop: '4px'
    },
    mb30: {
      marginBottom: '30px',
    },
    description: {
      fontSize: '14px',
      color: theme.palette.text.secondary,
      wordBreak: 'break-all',
      marginTop: '24px',
      marginBottom: '24px'
    },
    allowedTag: {
      fontSize: '14px',
      fontWeight: 600,
      marginRight: '12px',
      color: theme.palette.primary.main,
      display: 'inline-block',
      wordBreak: 'break-all',
      marginBottom: '16px',
      lineHeight: '19.6px'
    },
    prohibitedTag: {
      fontSize: '14px',
      fontWeight: 600,
      marginRight: '12px',
      color: theme.palette.secondary.main,
      display: 'inline-block',
      wordBreak: 'break-all',
      marginBottom: '16px',
      lineHeight: '19.6px'
    },
    user: {
      fontSize: '16px',
    },
    secondaryText: {
      fontSize: '12px',
      fontWeight: 600,
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
    },
    list: {
      padding: 0,
    },
    button: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '8px',
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
        flexDirection: 'column',
        alignItem: 'center',
      },
    },
    subscribe: {
      width: '221px',
      marginRight: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: {
        marginRight: 0,
        marginBottom: theme.spacing(1.5),
        width: '160px'
      },
    },
    clone: {
      width: '221px',
      marginRight: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: {
        marginRight: 0,
        marginBottom: theme.spacing(1.5),
        width: '160px'
      },
    },
    center: {
      marginTop: '8px',
      width: '240px'
    },
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
  }),
);
