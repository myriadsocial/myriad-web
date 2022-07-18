import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      ' .slate-Combobox': {
        zIndex: 2000,
      },
    },
    root: {
      background: '#FFF',
      border: '1px solid #F6F6F6',
      borderRadius: 10,
      padding: 16,

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    large: {
      width: 820,
    },
    toolbar: {
      padding: '12px 24px!important',
      background: '#F6F6F6',
      marginLeft: '0!important',
      marginRight: '0!important',
      border: '1px solid #F6F6F6',
      borderRadius: theme.spacing(1.25, 1.25, 0, 0),
    },
    editor: {
      position: 'relative',
    },
    progress: {
      width: 300,
      height: 40,
      background: '#FFFF',
      borderRadius: 10,
      padding: '6px 10px',
    },
    limit: {
      position: 'absolute',
      right: 8,
      bottom: -20,
    },
  }),
);
