import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownMenu: {
      marginBottom: theme.spacing(1.5),
    },
    rootPostsList: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      rowGap: 12,
    },
  }),
);
