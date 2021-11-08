import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '12px',
      lineHeight: '20px',
      color: theme.palette.text.secondary,
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      fontSize: 10,
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    linkGrey: {
      color: theme.palette.text.secondary,
      textDecoration: 'none',
    },
  }),
);
