import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      maxHeight: 400,
      width: 508,
      background: '#FFFFFF',
      borderRadius: 10,
      padding: 30,
    },
    list: {
      paddingTop: 0,
      maxHeight: 228,
      overflow: 'scroll',

      '& .MuiListItem-root:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    item: {
      overflow: 'hidden',
      padding: theme.spacing(1, 2),
    },
    accountDetail: {
      '& .MuiListItemText-secondary': {
        overflow: 'hidden',
        color: ' #4B4851',
        textOverflow: 'ellipsis',
      },
    },
    help: {
      padding: theme.spacing(1),
      textAlign: 'center',
      maxWidth: 390,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 16,
      fontWeight: 600,
      fontStyle: 'normal',
      lineHeight: '24px',
    },
    polkadot: {
      color: 'rgb(255, 140, 0)',
    },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 24,
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      fontSize: 10,
      color: '#BCBCBC',
    },
    buttonGroup: {
      width: '100%',
      padding: theme.spacing(2, 2, 0, 2),
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',

      '& .MuiButton-contained': {
        background: theme.palette.background.paper,
        fontSize: 16,
        fontWeight: 600,
        color: theme.palette.secondary.main,
      },
    },
  }),
);
