import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: 0,
    },
    tableRow: {
      '& .MuiTableCell-root': {
        borderBottom: 'none',
        paddingRight: 0,
        paddingTop: theme.spacing(1.25),
        paddingBottom: theme.spacing(1.25),
      },
    },
    tableCell: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      columnGap: theme.spacing(2.5),
      borderBottom: 'none',
      paddingLeft: 0,
      paddingRight: 0,
    },
    headerActionWrapper: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: theme.spacing(1),
    },
    refreshIcon: {
      paddingRight: 0,
      '& .MuiSvgIcon-root': {
        fill: 'none',
        paddingRight: theme.spacing(1),
      },
      '&:hover': {
        background: 'none',
      },
      fontSize: 13,
      marginLeft: 'auto',
    },
    balanceTabActions: {
      display: 'flex',
      justifyContent: 'space-between',
      columnGap: theme.spacing(2.875),
    },
  }),
);
