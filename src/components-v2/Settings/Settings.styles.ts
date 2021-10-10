import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 30,
    },
    title: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
    },
    option: {
      paddingLeft: 0,
      paddingTop: 18,
      paddingBottom: 18,
    },
  }),
);
