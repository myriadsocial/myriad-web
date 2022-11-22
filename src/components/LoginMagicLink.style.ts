import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      maxWidth: 530,
      padding: '50px 41px',
      background: '#FFFFFF',
      borderRadius: 10,
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      [theme.breakpoints.down('md')]: {
        padding: '30px 21px',
        width: 490,
      },
      [theme.breakpoints.down('xs')]: {
        padding: '30px 21px',
        width: 'unset',
      },
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
      [theme.breakpoints.down('md')]: {
        marginBottom: 4,
      },
    },
    title: {
      marginBottom: 12,
      '& .MuiTypography-h3': {
        color: '#0A0A0A',
        fontWeight: theme.typography.fontWeightBold,
      },
      [theme.breakpoints.down('md')]: {
        marginBottom: 4,
      },
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 12,
      '& .MuiTypography-root': {
        color: '#0A0A0A',
        fontWeight: theme.typography.fontWeightRegular,
      },
      [theme.breakpoints.down('md')]: {
        marginBottom: 4,
      },
    },
    otpWrapper: {
      margin: '12px 0px',
    },
  }),
);
