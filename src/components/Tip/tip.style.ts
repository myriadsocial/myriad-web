import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    refreshIcon: {
      '&:hover': {
        background: 'none',
      },
    },
    headerActionWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    secondaryAction: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    button: {
      width: 'auto',
      height: 'auto',
    },
    text: {
      textAlign: 'right',
    },
  }),
);
