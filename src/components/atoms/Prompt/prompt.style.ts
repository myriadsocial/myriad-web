import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    prompt: {
      width: 480,
      minHeight: 260,
      textAlign: 'center',
      padding: 30,
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    text: {
      fontWeight: 400,
      lineHeight: '20px',
      fontSize: '14px',
      whiteSpace: 'pre-line',
    },
    'm-vertical1': {
      marginBottom: 30,
      marginTop: 12,
    },
    'flex-center': {
      display: 'flex',
      justifyContent: 'center',
    },
    root: {
      '& .MuiPaper-rounded': {
        borderRadius: '20px',
      },
      [theme.breakpoints.down('md')]: {
        alignItems: 'flex-end',
      },
    },
    container: {
      [theme.breakpoints.down('xs')]: {
        alignItems: 'flex-end',
      },
    },
    content: {
      padding: 0,
    },
    icon: {
      fontSize: 60,
    },
    fill: {
      fill: 'currentColor',
    },
    title: {
      fontWeight: 600,
      lineHeight: '22.59px',
      fontSize: '18px',
    },
    danger: {
      color: '#FE3636',
    },
    warning: {
      color: '#FFC857',
    },
    success: {
      color: '#39BF87',
    },
    m1: {
      marginRight: theme.spacing(2),
    },
  }),
);
