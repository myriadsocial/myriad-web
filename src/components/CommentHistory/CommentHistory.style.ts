import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 20,
      paddingTop: 20,
      marginBottom: 12,
      background: theme.palette.background.paper,
      borderRadius: 10,
    },
    detail: {
      marginTop: theme.spacing(1),

      '& .MuiCardContent-root:last-child': {
        paddingBottom: 0,
      },

      '& .MuiCardHeader-root': {
        paddingTop: 10,
        paddingBottom: 10,
      },
    },
    comment: {
      boxShadow: 'none',
      backgroundColor: 'rgba(246, 246, 246, 0.5)',
    },
    link: {
      fontWeight: 400,
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    userLink: {
      fontWeight: 700,
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
    dot: {
      color: '#C4C4C4',
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    content: {
      padding: theme.spacing(0, 2),
    },
  }),
);
