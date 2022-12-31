import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type EditorStyleProps = {
  mobile?: boolean;
  counter?: boolean;
};

export const useStyles = makeStyles<Theme, EditorStyleProps>(theme =>
  createStyles({
    '@global': {
      ':root': {
        '--ck-border-radius': '10px!important',
        '--ck-color-mention-text': '#7342CC!important',
        '--ck-color-mention-background': 'none!important',
        '--ck-color-toolbar-background': '#F6F6F6!important',
      },
    },
    root: {
      background: '#FFF',
      borderRadius: 10,

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
      '& .ck-editor__editable, .ck-toolbar': {
        padding: '12px!important',
      },
    },
    mobile: {
      '& .ck-editor__top': {
        display: 'none!important',
      },
      '& .ck-editor__editable.ck-rounded-corners': {
        borderTopLeftRadius: '10px!important',
        borderTopRightRadius: '10px!important',
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
      paddingBottom: props => (props.counter ? 36 : 8),
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
    action: {},
  }),
);
