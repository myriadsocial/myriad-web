import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

//TODO: split this fx into sub-components
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    summary: {
      display: 'flex',
      marginTop: 12,
      alignItems: 'center',
      justifyContent: 'center',
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
      fontWeight: theme.typography.fontWeightBold,
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
  }),
);
