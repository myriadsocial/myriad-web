import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    detail: {
      position: 'relative',
    },
    profileContent: {
      width: 420,
    },
    avatarBig: {
      height: 72,
      width: 72,
      position: 'absolute',
      top: 46,
      left: 16,
    },
    media: {
      height: 159,
      width: 420,
      objectFit: 'cover',
      borderRadius: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    actions: {
      justifyContent: 'space-between',
    },
    logout: {
      textAlign: 'center',
    },
    bannerUploadWrapper: {
      position: 'absolute',
      top: 128,
      left: 250,
    },
    button: {
      backgroundColor: theme.palette.background.default,
      paddingRight: 24,
      paddingLeft: 24,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      borderRadius: theme.spacing(1),

      '&:hover': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    button2: {
      paddingRight: 40,
      paddingLeft: 40,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: '8px',
    },
    input: {
      marginTop: 8,
      background: 'white',
      borderRadius: 8,
      '& .MuiInputBase-root': {
        background: 'white',
      },
    },
    subtitle: {
      fontWeight: 700,
      fontSize: 16,
      color: '#4B4851',
    },
  }),
);
