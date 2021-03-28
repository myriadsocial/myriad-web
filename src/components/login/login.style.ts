import { createStyles, Theme, makeStyles, lighten } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.primary.light,
      padding: '15px 29px',
      color: '#E0E0E0',
      flex: '0 0 100%',
      width: 320
    },
    title: {
      paddingBottom: 10,
      borderBottom: '5px solid',
      borderBottomColor: theme.palette.secondary.main
    },
    action: {
      marginTop: 25
    },
    button: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      textTransform: 'none'
    },
    buttonIcon: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      '&& .MuiButton-label': {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: '60%'
      }
    },
    lightButton: {
      marginBottom: 10,
      backgroundColor: lighten('#E849BD', 0.3),
      textAlign: 'left',
      borderRadius: 20
    },
    btnCreateAccount: {
      margin: '8px 16px'
    }
  })
);
