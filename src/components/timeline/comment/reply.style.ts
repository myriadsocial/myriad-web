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
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#171717',
        borderBottom: 0
      },

      '& .MuiOutlinedInput-root': {
        border: theme.spacing(1),
        '&:focus-visible': {
          outline: 'none'
        }
      },

      '& .MuiFormHelperText-root': {
        textAlign: 'right',
        borderColor: '#171717',
        border: theme.spacing(1),
        borderTop: 0,
        borderLeft: 0,
        padding: '0 14px',
        margin: 0,
        borderRadius: theme.spacing(1)
      }
    }
  })
);
