import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      maxWidth: 600,
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {},
    transparentHeader: {
      '& .MuiDialogTitle-root': {
        background: theme.palette.background.default,
      },
    },
    tileTitle: {
      height: 200,
      textAlign: 'center',
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
      [theme.breakpoints.down('lg')]: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    tileTitleVertical: {
      height: 162,
      textAlign: 'center',
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
      top: 4,
      left: 4,
      right: 4,
      bottom: 4,

      [theme.breakpoints.down('lg')]: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    imageGrid: {
      width: '100%',
    },
    icon: {
      fill: '#FFF',
    },
    close: {
      position: 'absolute',
      top: 30,
      right: 30,
      zIndex: 2,
      '& .MuiSvgIcon-root': {
        fill: theme.palette.primary.main,
      },
    },
    preview: {
      height: '100vh',
      textAlign: 'center',
    },
    navButton: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFF',
    },
  }),
);
