import {createStyles, makeStyles, Theme} from '@material-ui/core';

type ErrorStyleProps = {
  disableBorder?: boolean;
};

export const useStyles = makeStyles<Theme, ErrorStyleProps>(theme =>
  createStyles({
    root: {
      background: '#FFF',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      [theme.breakpoints.up('xs')]: {
        '&::before': {
          content: props => (props.disableBorder ? 'none' : '""'),
          position: 'absolute',
          width: '1.48vw',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: '#FFC857',
        },
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 18,
        borderLeft: 0,
        padding: '0 20px',
      },
    },
    logo: {
      marginBottom: 24,
    },
    illustration: {
      marginBottom: 24,
    },
    title: {
      lineHeight: '33.6px',
      marginBottom: 20,
      fontWeight: 700,
      fontSize: 28,
      [theme.breakpoints.down('lg')]: {
        marginBottom: 8,
        fontSize: 20,
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 18,
        lineHeight: '140%',
        fontWeight: 600,
        color: '#0A0A0A',
      },
    },
    subtitle: {
      lineHeight: '25.1px',
      marginBottom: 84,
      fontSize: 20,
      [theme.breakpoints.down('lg')]: {
        marginBottom: 42,
        fontSize: 14,
      },
      [theme.breakpoints.down('xs')]: {
        marginBottom: 24,
        lineHeight: '19.6px',
      },
    },
  }),
);
