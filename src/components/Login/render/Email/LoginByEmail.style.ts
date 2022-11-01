import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

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
