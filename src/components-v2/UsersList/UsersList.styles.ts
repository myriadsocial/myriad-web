import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(3.75),
    },
    avatar: {
      minWidth: theme.spacing(3.75),
      marginRight: 20,
    },
    icon: {
      minWidth: 24,
      marginRight: 20,
      padding: 6,
    },
    tiny: {
      width: 12,
      height: 12,
    },
    small: {
      width: theme.spacing(3.75),
      height: theme.spacing(3.75),
    },
    medium: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  }),
);
