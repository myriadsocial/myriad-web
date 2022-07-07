import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    listItem: {
      '&.MuiListItem-root': {
        '&.MuiListItem-gutters': {
          paddingRight: '0px',
          paddingLeft: '0px',
        },
      },
    },
    content: {
      background: '#F6F7FC',
      borderRadius: '20px',
      height: '159px',
      padding: '20px',
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonClaim: {
      width: '128.75px',
    },
    refreshIcon: {
      '&:hover': {
        background: 'none',
      },
    },
    headerActionWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    secondaryAction: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    button: {
      width: 'auto',
      height: 'auto',
    },
    text: {
      marginTop: theme.spacing(2),
      textAlign: 'left',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    avatar: {
      height: '32px',
      width: '32px',
    },
    contentReference: {
      marginTop: 22,
      background: '#F6F7FC',
      padding: 20,
      height: 237,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 20,
    },
    title: {
      fontWeight: 700,
      marginBottom: 8,
    },
    desc: {
      textAlign: 'center',
      marginBottom: 24,
      marginLeft: 30,
      marginRight: 30,
    },
  }),
);
