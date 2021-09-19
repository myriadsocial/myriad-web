import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    title: {
      textAlign: 'center',
      marginBottom: 20,
      marginTop: -10,
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
    fullwidth: {
      width: '100%',
    },
    facebook: {
      color: '#3b5998',
      minWidth: 40,
    },
    twitter: {
      color: '#1DA1F2',
      minWidth: 40,
    },
    reddit: {
      color: '#FF5700',
      minWidth: 40,
    },
    term: {
      fontWeight: 700,
      textDecoration: 'none',
    },
  }),
);
