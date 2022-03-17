import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    walletButton: {
      width: '125px',
      background: '#F6F7FC',
      fontSize: '14px',
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
    },
  }),
);
