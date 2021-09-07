import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 14,
      lineHeight: '18px',
      color: theme.palette.text.secondary,
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      fontSize: 10,
    },
  }),
);
