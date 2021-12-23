import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    prompt: {
      width: '480px',
      height: '260px',
      textAlign: 'center',
      padding: 30,
    },
    text: {
      fontWeight: 400,
      lineHeight: '17.57px',
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
      fontWeight: 700,
      lineHeight: '22.59px',
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
