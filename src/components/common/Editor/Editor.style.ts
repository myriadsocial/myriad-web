import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type EditorStyleProps = {
  mobile?: boolean;
  counter?: boolean;
};

export const useStyles = makeStyles<Theme, EditorStyleProps>(theme =>
  createStyles({
    '@global': {
      ' .slate-Combobox': {
        zIndex: 2000,
      },

      '.slate-a': {
        color: theme.palette.primary.main,
      },
    },
    root: {
      background: '#FFF',
      borderRadius: 10,

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    large: {
      width: props => (props.mobile ? '100%' : 820),
    },
    toolbar: {
      padding: '12px 12px!important',
      background: '#F6F6F6',
      marginLeft: '0!important',
      marginRight: '0!important',
      border: '1px solid #F6F6F6',
      borderRadius: theme.spacing(1.25, 1.25, 0, 0),
    },
    editor: {
      position: 'relative',
      padding: props => (props.mobile ? 16 : 8),
      paddingBottom: props => (props.counter ? 36 : 16),
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
      bottom: 8,
    },
  }),
);
