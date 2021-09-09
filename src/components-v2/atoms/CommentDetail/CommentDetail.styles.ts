import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    comment: {
      marginBottom: theme.spacing(1),
      boxShadow: 'none',
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      color: theme.palette.text.secondary,
      fontSize: 10,
    },
    content: {
      padding: theme.spacing(1, 2),
    },
    text: {
      fontSize: 14,
      lineHeight: '18px',
    },
    button: {
      width: 'auto',
      height: 'auto',
      color: theme.palette.text.secondary,
    },
    flex: {
      display: 'flex',
    },
    avatar: {
      marginRight: 12,
    },
    fullWidth: {
      width: '100%',
    },
  }),
);
