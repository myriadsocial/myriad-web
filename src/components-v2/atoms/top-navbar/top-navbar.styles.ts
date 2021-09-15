import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      background: '#FFFFFF',
      borderRadius: `0px 0px 10px 10px`,
      paddingLeft: theme.spacing(3.75),
      paddingTop: theme.spacing(4.125),
      paddingBottom: theme.spacing(1.75),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      columnGap: theme.spacing(2.125),
    },
    icon: {
      width: 20,
      position: 'relative',
      bottom: 5,
    },
    textWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    sectionTitle: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 20,
    },
  }),
);
