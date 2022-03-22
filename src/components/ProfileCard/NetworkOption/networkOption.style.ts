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
    menu: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: 8,
        height: 40.99,
        borderRadius: theme.spacing(0, 1.25, 1.25, 0),
        background: theme.palette.primary.main,
      },
    },
  }),
);
