import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      marginBottom: theme.spacing(1)
    },
    postAction: {
      marginTop: theme.spacing(1)
    },
    write: {
      backgroundColor: '#171717',
      borderRadius: theme.spacing(1),
      '& .MuiFormHelperText-root': {
        textAlign: 'right',
        borderColor: 'rgba(255, 255, 255, 0.23)',
        border: '1px solid',
        borderTop: 0,
        padding: '0 14px',
        margin: 0,
        borderRadius: 8
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderBottom: 0
      }
    }
  })
);
