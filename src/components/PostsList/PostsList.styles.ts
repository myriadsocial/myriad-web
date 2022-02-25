import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      background: 'transparent',
    },
    dropdownMenu: {
      marginBottom: theme.spacing(1.5),
    },
    sort: {
      position: 'absolute',
      right: 0,
      top: -77,
    },
  }),
);
