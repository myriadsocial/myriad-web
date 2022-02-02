import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 30,
      background: '#FFF',
      borderRadius: 10,
    },
    avatar: {
      width: '68px',
      height: '68px',
      marginBottom: '20px',
    },
    photo: {
      width: '48px',
      height: '48px',
      marginRight: '20px',
    },
    experienceName: {
      fontSize: '18px',
      fontWeight: 700,
    },
    subtitle: {
      fontSize: '16px',
      fontWeight: 600,
      marginBottom: '12px',
    },
    mb: {
      marginBottom: '10px',
    },
    mb30: {
      marginBottom: '30px',
    },
    description: {
      fontSize: '14px',
      color: theme.palette.text.secondary,
      wordBreak: 'break-all',
    },
    tag: {
      fontSize: '14px',
      fontWeight: 600,
      marginRight: '12px',
      color: theme.palette.primary.main,
      display: 'inline-block',
      wordBreak: 'break-all',
    },
    user: {
      fontSize: '16px',
    },
    secondaryText: {
      fontSize: '12px',
      fontWeight: 600,
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
    },
    list: {
      padding: 0,
    },
    button: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '60px',
    },
    center: {
      marginTop: '60px',
    },
  }),
);
