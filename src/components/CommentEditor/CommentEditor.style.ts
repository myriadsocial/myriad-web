import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

type CommentEditorProps = {
  mobile: boolean;
};

export const useStyles = makeStyles<Theme, CommentEditorProps>(theme =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    editor: {
      position: 'relative',
      width: 'calc(100% - 52px)',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: 12,
      border: '1px solid #E5E5E5',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('xs')]: {
        width: 'calc(100% - 36px)',
      },
      '& .slate-p': {
        wordBreak: 'break-word',
      },
    },
    action: {
      paddingTop: 8,
      padding: 0,
      justifyContent: 'space-between',

      '& .MuiButtonGroup-grouped': {
        minWidth: 24,
      },
      '& .MuiIconButton-root': {
        padding: 2,
        marginRight: 8,
      },
      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
    },
    replyIcon: {
      color: theme.palette.primary.main,
      transform: 'rotate(45deg)',
    },
    disabled: {
      color: theme.palette.text.secondary,
      transform: 'rotate(45deg)',
    },
  }),
);
