import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogActions: {
      justifyContent: 'center',
      background: theme.palette.background.default,
    },
    paragraph: {
      letterSpacing: '0em',
      lineHeight: '28px',
      fontWeight: 400,
      color: '#4B4851',
      fontSize: 16,
    },
    center: {
      textAlign: 'center',
    },
    mb: {
      marginBottom: theme.spacing(1),
    },
    mb2: {
      marginBottom: theme.spacing(4),
    },
    primary: {
      fontWeight: 'bold',
      color: '#8629E9',
    },
  }),
);
