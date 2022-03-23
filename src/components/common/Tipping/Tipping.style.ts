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
      paddingBottom: 30,
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
      padding: '0 30px',
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
    formControls: {
      marginTop: 12,
      '& > *': {
        marginTop: 8,
      },
    },
    balanceSection: {
      marginTop: 12,
      display: 'flex',
      justifyContent: 'flex-start',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    noBackdrop: {},
  }),
);
