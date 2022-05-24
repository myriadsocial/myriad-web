import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    editor: {
      width: 'calc(100% - 52px)',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: 12,
      border: '1px solid #E5E5E5',
      display: 'flex',
      flexDirection: 'column-reverse',

      '& .slate-p': {
        wordBreak: 'break-word',
      },
    },
    action: {
      paddingTop: 0,
      justifyContent: 'space-between',

      '& .MuiButtonGroup-grouped': {
        minWidth: 24,
      },
      '& .MuiIconButton-root': {
        padding: 2,
        marginRight: 8,
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
