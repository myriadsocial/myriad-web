import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1, 1, 3),
      background: '#FFF',
    },
    header: {
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
    },
    icon: {
      width: 38,
      marginRight: 20,
    },
    action: {
      marginBottom: 20,
    },
    option: {
      marginTop: 8,
      '& > *': {
        marginRight: 8,
      },
    },
    input: {
      marginBottom: 30,
    },
  }),
);
