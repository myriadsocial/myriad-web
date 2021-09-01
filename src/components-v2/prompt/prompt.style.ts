import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    prompt: {
      width: '480px',
      height: '280px',
      textAlign: 'center',
    },
    text: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '17.57px',
    },
    'm-vertical1': {
      marginBottom: 20,
      marginTop: 20,
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
    icon: {
      fontSize: 60,
      marginTop: '20px',
    },
  }),
);
