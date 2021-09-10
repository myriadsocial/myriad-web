import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    xtraSmall: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    small: {
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
    },
    medium: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    large: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
  }),
);

export default useStyles;
