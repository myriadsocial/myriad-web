import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      color: '#E0E0E0',
      maxHeight: 400,
      overflowY: 'scroll',
    },
    scrollable: {
      maxHeight: 420,
      overflowY: 'auto',
      padding: 0,
    },
    textSecondary: {
      color: '#E0E0E0',
    },
    action: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white,
    },
    badge: {
      textAlign: 'right',
      '& > *': {
        margin: '4px 2px',
        textAlign: 'right',
        height: theme.spacing(2),
        textTransform: 'uppercase',
      },
    },
    avatar: {
      minWidth: 40,
    },
    green: {
      backgroundColor: '#4caf50',
      color: '#FFF',
    },
    received: {
      color: '#4caf50',
    },
    red: {
      backgroundColor: '#f44336',
      color: '#FFF',
    },
    sent: {
      color: '#f44336',
    },
    loading: {
      color: '#A942E9',
    },
    panel: {
      padding: '4px',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    list: {
      maxHeight: 530,
      overflow: 'auto',
    },
    transactionItem: {
      background: '#DDDDDD',
      '& .MuiCardHeader-root, & .MuiCardActions-root': {
        background: '#EFEFEF',
      },
    },
    transactionActionList: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      alignItems: 'flex-start',
    },
    iconButton: {
      margin: theme.spacing(1),
    },
    typography: {
      padding: theme.spacing(2),
    },
  }),
);
