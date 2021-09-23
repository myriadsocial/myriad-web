import MuiTableCell from '@material-ui/core/TableCell';
import {withStyles, makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell);

//TODO: split this fx into sub-components
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 340,
      position: 'relative',
      minHeight: 680,
      background: '#FFFFFF',
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,
    },
    header: {
      fontWeight: 700,
      paddingTop: 30,
      textAlign: 'center',
    },
    description: {
      textAlign: 'center',
      paddingTop: 12,
    },
    subHeader: {
      fontWeight: 700,
    },
    subHeaderSection: {
      padding: '0 8%',
      marginTop: 30,
    },
    formRoot: {
      marginTop: 12,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& > p': {
        alignSelf: 'flex-start',
        margintop: 12,
      },
      '& > input:nth-child(1)': {
        margin: 0,
      },
    },
    formInput: {
      zIndex: 10,
      backgroundColor: '#FFF',
    },
    formStreak: {
      content: '""',
      position: 'absolute',
      width: 340,
      height: 24,
      left: 0,
      top: 228,

      background: theme.palette.secondary.main,
    },
    formControls: {
      marginTop: 12,
      '& > *': {
        marginTop: 8,
      },
    },
    checkBox: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
        color: theme.palette.primary.main,
      },
    },
    balanceSection: {
      marginTop: 12,
      display: 'flex',
      justifyContent: 'flex-start',
    },
    receiverSummary: {
      display: 'flex',
      marginTop: 12,
      alignItems: 'center',
      justifyContent: 'center',
      '& > p': {
        marginLeft: theme.spacing(1.5),
      },
    },
    clickableText: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  }),
);
