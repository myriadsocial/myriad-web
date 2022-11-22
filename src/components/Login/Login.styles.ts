import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    iconMobile: {
      width: '100%',
      padding: '30px 63.5px 20px 63.5px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    iconTitle: {fontSize: 16, fontWeight: 400},
    loading: {
      color: theme.palette.primary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);
