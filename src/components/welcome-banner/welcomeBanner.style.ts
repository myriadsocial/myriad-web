import {createStyles, Theme, makeStyles, lighten} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogActions: {
      justifyContent: 'center',
      background: theme.palette.background.default,
    },
  }),
);
