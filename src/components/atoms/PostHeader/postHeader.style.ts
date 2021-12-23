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
    danger: {
      color: theme.palette.error.main,
    },
    menu: {
      maxWidth: 'max-content',
    },
  }),
);
