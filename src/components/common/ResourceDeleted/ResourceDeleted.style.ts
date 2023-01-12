import {createStyles, makeStyles, Theme} from '@material-ui/core';

type ErrorStyleProps = {
  disableBorder?: boolean;
};

export const useStyles = makeStyles<Theme, ErrorStyleProps>(theme =>
  createStyles({
    root: {
      background: '#FFF',
      height: '100%',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      borderRadius: '10px',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
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
