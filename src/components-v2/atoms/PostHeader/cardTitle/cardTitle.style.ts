import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    link: {
      fontFamily: theme.typography.fontFamily,
      fontSize: 20,
      lineHeight: '18px',
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  }),
);
