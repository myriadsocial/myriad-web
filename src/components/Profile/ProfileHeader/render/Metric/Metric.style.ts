import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 240,
    },
    username: {
      fontWeight: 700,
      lineHeight: '17.57px',
    },
    total: {
      fontWeight: 700,
      lineHeight: '20.08px',
    },
  }),
);
