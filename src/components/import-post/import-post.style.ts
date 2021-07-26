import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      overflow: 'visible',
    },
    label: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      textAlign: 'center',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
      borderRadius: theme.spacing(1),
      cursor: 'pointer',
    },
    post: {
      marginLeft: 'auto !important',
      marginTop: theme.spacing(2),
    },
    cardActions: {
      justifyContent: 'center',
      background: theme.palette.background.default,
    },
    postContent: {
      width: 600,
      padding: theme.spacing(1, 0),
      boxShadow: 'none',
    },
    postURL: {
      width: '100%',
      padding: theme.spacing(1),
      border: 0,
      borderRadius: 2,
      fontSize: 16,
    },
    subtitle: {
      paddingLeft: 0,
      fontSize: 14,
    },
    tag: {
      margin: theme.spacing(2, 0),
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);
