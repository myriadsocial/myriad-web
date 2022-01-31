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
    },
    icon: {
      width: 20,
      position: 'relative',
      bottom: 5,
      '& .MuiSvgIcon-root': {
        fill: 'none',
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
    },
  }),
);
