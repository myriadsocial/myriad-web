import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      maxHeight: 'fit-content',
      maxWidth: 508,
      background: '#FFFFFF',
      borderRadius: 10,
      padding: 40,
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      '& .MuiFormControl-root': {
        marginBottom: 0,
      },
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    icon: {
      width: 80,
      fontSize: 32,
      marginBottom: 8,
      [theme.breakpoints.down('md')]: {
        width: 60,
        fontSize: 26,
      },
    },
    list: {
      display: 'flex',
      boxSizing: 'border-box',

      '& .MuiListItem-root': {
        display: 'block',
        boxSizing: 'border-box',
        paddingLeft: 2,
        paddingRight: 2,
      },
      '& .Mui-selected': {
        border: '1px solid #6E3FC3',
        borderRadius: 10,
        backgroundColor: 'inherit',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 1,
        paddingRight: 1,
        [theme.breakpoints.down('md')]: {
          paddingTop: 5,
          paddingBottom: 5,
        },
      },
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
      cursor: 'pointer',
      [theme.breakpoints.down('md')]: {
        padding: 5,
      },
    },
    subtitle: {
      fontSize: 14,
      fontWeight: 'normal',
      color: 'black',
      textAlign: 'center',
    },
    actionWrapper: {
      display: 'flex',
      flexDirection: 'row',
      gap: 24,
    },
  }),
);
