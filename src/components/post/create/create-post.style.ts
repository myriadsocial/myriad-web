import {createStyles, makeStyles, Theme, lighten} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(0, 1),
      overflow: 'visible',
    },
    dialog: {
      '&. MuiPaper-root': {
        minWidth: 800,
      },
    },
    button: {
      margin: theme.spacing(1),
    },
    createPost: {
      marginLeft: 'auto !important',
      marginRight: 8,
    },
    label: {
      backgroundColor: lighten(theme.palette.background.paper, 0.3),
      textAlign: 'center',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
      cursor: 'pointer',
    },
    postTextArea: {
      resize: 'none',
      fontFamily: theme.typography.fontFamily,
      width: '100%',
      padding: theme.spacing(1),
      border: 0,
      borderRadius: theme.spacing(1),
      background: theme.palette.background.paper,
      fontSize: 16,
      height: 56,
      '&:focus-visible': {
        outline: 'none',
      },
    },

    tags: {
      '& .MuiInputBase-root': {
        background: '#FFFFFF',
        border: 0,
      },
    },

    card: {
      width: 800,
      padding: theme.spacing(1, 0),
      boxShadow: 'none',
    },
    cardPost: {
      background: lighten(theme.palette.background.default, 0.2),
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.08))',
    },
    cardPostAction: {
      background: lighten(theme.palette.background.default, 0.2),
    },
    cardHeader: {
      padding: theme.spacing(1),
      borderBottom: 'none',
      '& .MuiCardHeader-title': {
        fontSize: 18,
        fontWeight: 400,
      },
      '& .MuiCardHeader-action': {
        flex: '0 1 auto',
        marginTop: 0,
        marginRight: 0,
        alignSelf: 'center',
      },
    },

    additionalAction: {
      border: '1px solid #6D15CB',
      borderRadius: theme.spacing(0.5),
      padding: theme.spacing(0, 1),
      margin: theme.spacing(2, 0),
      width: 458,
      height: 44,
    },
    postButton: {
      width: 320,
      margin: '0 auto',
      marginTop: theme.spacing(2),
    },
    action: {
      background: theme.palette.background.default,
    },

    buttonProgress: {
      color: theme.palette.primary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    screen: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 8,
      cursor: 'pointer',
    },
  }),
);
