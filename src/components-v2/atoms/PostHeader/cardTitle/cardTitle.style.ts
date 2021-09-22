import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    link: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: '20.08px',
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  }),
);
