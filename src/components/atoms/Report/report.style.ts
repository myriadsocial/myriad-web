import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 460,
      marginTop: 8,

      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    flex: {display: 'flex', justifyContent: 'space-between'},
    name: {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
    secondaryText: {
      fontSize: '12px',
      color: theme.palette.text.secondary,
      marginBottom: '40px',
    },
    box: {
      position: 'relative',
      paddingTop: 30,
      marginBottom: 30,
    },
    count: {
      color: theme.palette.text.secondary,
      position: 'absolute',
      right: 10,
      bottom: 40,
    },
    description: {
      marginBottom: 0,

      '& .MuiFormHelperText-root': {
        position: 'absolute',
        bottom: 4,
        right: 0,
      },
    },
  }),
);
