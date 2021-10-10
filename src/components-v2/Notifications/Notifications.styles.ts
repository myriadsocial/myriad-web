import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0',
      padding: 30,
    },
    header: {
      textAlign: 'center',
    },
    title: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
    },
    content: {
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 600,
    },
    list: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),

      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
    },
    avatar: {
      width: '50px',
      height: '50px',
    },
  }),
);
