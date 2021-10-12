import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2, 0),
      border: '1px solid #E5E5E5',
      borderRadius: 5,
    },
    media: {
      height: 240,
    },
  }),
);
