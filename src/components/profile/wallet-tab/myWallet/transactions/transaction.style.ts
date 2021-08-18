import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    red: {
      backgroundColor: '#f44336',
      color: '#FFF',
    },
    loading: {
      color: '#A942E9',
    },
    rootPanel: {
      paddingTop: 24,
      paddingBottom: 2,
    },
    panelHeader: {
      paddingLeft: 16,
      paddingRight: 16,
      marginBottom: 8,
    },
    panelButtons: {
      paddingLeft: 4,
      paddingRight: 4,
      marginBottom: 2,
    },
    iconButton: {
      margin: theme.spacing(1),
    },
  }),
);
