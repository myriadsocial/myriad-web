import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 0,

      '& > *': {
        marginBottom: theme.spacing(1.5),
      },
    },
  }),
);
