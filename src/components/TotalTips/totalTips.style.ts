import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: 8,
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
    wrapperButton: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);
