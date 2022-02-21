import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#FFFFFF',
      borderRadius: `0px 0px 10px 10px`,
      padding: theme.spacing(4.125, 3.75, 1.75, 3.75),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      columnGap: theme.spacing(2.125),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0, 4),
        borderRadius: `0px`,
        height: '56px',
      },
    },
    icon: {
      width: 20,
      position: 'relative',
      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        fontWeight: theme.typography.fontWeightMedium,
        color: '#404040',
      },
    },
    textWrapper: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    sectionTitle: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 20,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    description: {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
  }),
);
