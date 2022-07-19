import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

//TODO: split this fx into sub-components
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    summary: {
      width: '100%',
      display: 'flex',
      marginTop: 12,
      alignItems: 'center',
      '& > p': {
        marginLeft: theme.spacing(1.5),
      },
    },
    description: {
      marginLeft: 10,
    },
    detail: {
      marginTop: 30,
      width: '100%',

      '& .MuiTableCell-root': {
        borderBottom: 'none',
      },
    },
    bold: {
      fontWeight: 700,
      height: 34,
    },
    table: {
      padding: '6px 0px',
      height: 32,
      '& .MuiTableCell-sizeSmall': {
        padding: '6px 0px 6px 16px',
        lineHeight: 12,
      },
      '&:last-child': {
        paddingRight: 0,
      },
    },
    clickableText: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    warningNoNear: {
      display: 'flex',
      justifyContent: 'space-between',
      background: '#FFC85726',
      padding: 12,
      borderRadius: 8,
      marginTop: 26,
    },
    wrapperIcon: {
      marginRight: 12,
    },
    textWarning: {
      fontSize: 12,
      fontWeight: 400,
      textAlign: 'justify',
    },
  }),
);
