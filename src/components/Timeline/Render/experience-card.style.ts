import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      minHeight: 100,
      marginBottom: 16,
      borderRadius: 10,
      padding: 16,
      display: 'flex',
      gap: 8,
    },
    content: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      width: '100%',
    },
    icon: {
      [theme.breakpoints.down('xs')]: {
        color: '#404040',
      },
    },
    menu: {
      borderRadius: 10,
      marginTop: 8,
    },
    delete: {
      color: '#FE3636',
    },
    modal: {
      paddingBottom: 10,
    },
    input: {
      width: 560,
      marginBottom: 0,
      marginTop: 10,

      '& .MuiInputLabel-root, .MuiInputBase-root': {
        color: '#616161',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    copy: {},
  }),
);
