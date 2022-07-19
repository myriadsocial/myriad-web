import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '.slate-a': {
        color: theme.palette.primary.main,
      },
    },
    root: {
      padding: '10px 0',
    },
  }),
);
