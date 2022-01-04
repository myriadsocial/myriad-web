import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: 0,
    },
    innerRoot: {
      marginTop: theme.spacing(2.5),
      marginBottom: theme.spacing(2.5),
      display: 'flex',
      flexDirection: 'column',
      rowGap: theme.spacing(1.5),
    },
    listRoot: {
      margin: 0,
      padding: 0,
      position: 'relative',
      listStyle: 'none',
      '& .MuiListItem-gutters': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    primaryCoinWrapper: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    balanceTabActions: {
      display: 'flex',
      justifyContent: 'space-between',
      columnGap: theme.spacing(2.875),
    },
    cardRoot: {
      width: '100%',
      border: '1px solid #EDEDED',
      boxSizing: 'border-box',
      borderRadius: 10,
      boxShadow: 'none',
      '& .MuiCardContent-root:last-child': {
        paddingBottom: theme.spacing(2),
      },
    },
    cardContentWrapper: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    leftJustifiedWrapper: {
      display: 'flex',
      alignItems: 'center',
      columnGap: theme.spacing(2.5),
    },
    rightJustifiedWrapper: {
      marginLeft: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: theme.spacing(1.875),
    },
    cursor: {
      cursor: 'pointer',
    },
  }),
);
