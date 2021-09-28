import {makeStyles, createStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme =>
  createStyles({
    buttonPrimary: {
      backgroundColor: theme.palette.primary.main,
    },
    buttonSecondary: {
      backgroundColor: theme.palette.secondary.main,
    },
  }),
);

export default useStyles;
