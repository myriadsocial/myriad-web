import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    action: {
      display: 'block',
      position: 'relative',
      top: 10,

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    header: {
      position: 'relative',
      background: '#FFF',
      borderRadius: 10,

      '& .MuiCardHeader-title': {
        fontSize: theme.typography.h4.fontSize,
        lineHeight: '24px',
        fontWeight: 'bold',
      },
    },
    headerRoot: {
      [theme.breakpoints.down('xs')]: {
        padding: '10px 20px',
      },
    },
    danger: {
      color: theme.palette.error.main,
    },
    menu: {
      maxWidth: 'max-content',
    },
    title: {
      cursor: 'pointer',
      [theme.breakpoints.down('xs')]: {
        fontWeight: 500,
      },
    },
    icon: {
      [theme.breakpoints.down('xs')]: {
        height: '20px',
        color: '#404040',
      },
    },
  }),
);
