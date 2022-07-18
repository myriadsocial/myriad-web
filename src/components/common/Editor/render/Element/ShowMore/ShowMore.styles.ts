import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    link: {
      cursor: 'pointer',
      color: theme.palette.primary.main,
      width: 'auto',
      '&:hover': {
        background: 'none',
      },
    },
  }),
);
