import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    prompt: {
      width: '480px',
      height: '260px',
      textAlign: 'center',
    },
    text: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '17.57px',
    },
    'm-vertical1': {
      marginBottom: 50,
      marginTop: 12,
    },
    'flex-center': {
      display: 'flex',
      justifyContent: 'space-evenly',
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
      marginTop: '30px',
    },
    fill: {
      fill: 'currentColor',
    },
    title: {
      fontSize: '18px',
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
  }),
);
