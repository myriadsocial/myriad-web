import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: 8,
    },
    title: {
      textAlign: 'center',
      marginBottom: 20,
      marginTop: 0,
    },
    steps: {
      width: 340,
      '& .MuiListItem-root:nth-child(even)': {
        background: 'inherit',
      },

      '& .MuiFormControl-root': {
        marginBottom: 10,
      },
    },
    caption: {
      marginBottom: 10,
    },
    post: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginTop: 20,
    },
    fullWidth: {
      width: '100%',
    },
    facebook: {
      '& rect': {
        fill: '#4E71A8',
      },
    },
    reddit: {
      '& rect': {
        fill: '#FF4500',
      },
    },
    twitter: {
      '& rect': {
        fill: '#1DA1F2',
      },
    },
    term: {
      fontWeight: 700,
      textDecoration: 'none',
    },
    icon: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    loading: {
      color: theme.palette.primary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);
