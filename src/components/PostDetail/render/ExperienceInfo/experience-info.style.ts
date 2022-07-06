import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      cursor: 'pointer',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: 48,
      padding: 16,
      width: 378,
    },
    card: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
    },
    avatar: {width: 64, height: 64},
  }),
);
