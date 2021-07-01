import Badge from '@material-ui/core/Badge';
import MuiTableCell from '@material-ui/core/TableCell';
import { createStyles, Theme, makeStyles, lighten, withStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.primary.light,
      padding: '15px 29px',
      color: '#E0E0E0',
      flex: '0 0 100%',
      width: 320
    },
    title: {
      paddingBottom: 10,
      borderBottom: '5px solid',
      borderBottomColor: theme.palette.secondary.main
    },
    action: {
      marginTop: 25
    },
    button: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      textTransform: 'none'
    },
    buttonIcon: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      '&& .MuiButton-label': {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: '60%'
      }
    },
    whiteLightButton: {
      marginBottom: 10,
      backgroundColor: lighten('#f4f5e2', 0.3),
      textAlign: 'left',
      borderRadius: 20
    },
    lightButton: {
      marginBottom: 10,
      backgroundColor: lighten('#E849BD', 0.3),
      textAlign: 'left',
      borderRadius: 20
    },
    btnCreateAccount: {
      margin: '8px 16px'
    },
    info: {
      marginBottom: theme.spacing(2)
    },
    polkadot: {
      color: 'rgb(255, 140, 0)'
    },
    spinner: {
      color: '#A942E9',
      position: 'relative',
      top: 4,
      left: 6
    },
    sendTipDialog: {
      minWidth: '400px'
    },
    errorText: {
      color: 'red'
    },
    balanceText: {
      width: '100%',
      padding: '2px',
      fontWeight: 700
    },
    tooltipContentHeader: {
      fontWeight: 'bold'
    },
    tooltipContentRoot: { display: 'flex', flexDirection: 'column' }
  })
);

// Custom table
export const TableCell = withStyles({
  root: {
    borderBottom: 'none',
    paddingTop: 3,
    paddingBottom: 3
  }
})(MuiTableCell);

// Custom badge
export const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -5,
      top: 0
    }
  })
)(Badge);
