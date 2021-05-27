import { createStyles, makeStyles, Theme, lighten } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      overflow: 'visible'
    },
    dialog: {
      '&. MuiPaper-root': {
        minWidth: 800
      }
    },
    button: {
      margin: theme.spacing(1)
    },
    createPost: {
      marginLeft: 'auto !important',
      marginRight: 8
    },
    label: {
      backgroundColor: lighten(theme.palette.background.paper, 0.3),
      textAlign: 'center',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
      cursor: 'pointer'
    },
    postHeader: {
      padding: theme.spacing(1),
      borderBottom: 'none',
      '& .MuiCardHeader-title': {
        fontSize: 18,
        fontWeight: 400
      },
      '& .MuiCardHeader-action': {
        flex: '0 1 auto',
        marginTop: 0,
        marginRight: 0,
        alignSelf: 'center'
      }
    },
    postContent: {
      width: 800,
      padding: theme.spacing(1, 0),
      boxShadow: 'none'
    },
    postTextArea: {
      width: '100%',
      padding: theme.spacing(2),
      border: 0,
      borderRadius: theme.spacing(0.5),
      fontSize: 16,

      '&:focus-visible': {
        outline: 'none'
      }
    },
    additionalAction: {
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: theme.spacing(0.5),
      padding: theme.spacing(0, 1),
      margin: theme.spacing(2, 0),
      width: '50%'
    },
    postButton: {
      margin: '0 auto',
      marginTop: theme.spacing(2)
    }
  })
);
