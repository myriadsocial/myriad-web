import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    avatar: {
      marginRight: 12,
    },
    editor: {
      width: 'calc(100% - 52px)',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(1),
      border: '1px solid',
      borderColor: '#E5E5E5',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column-reverse',
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
