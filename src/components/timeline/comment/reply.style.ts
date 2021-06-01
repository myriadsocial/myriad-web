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
      padding: theme.spacing(1),
      backgroundColor: '#F7F7F7',
      borderRadius: theme.spacing(1),
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#F7F7F7',
        borderBottom: 0
      },

      '& .MuiOutlinedInput-root': {
        border: theme.spacing(1),
        '&:focus-visible': {
          outline: 'none'
        },
        '&:hover': {
          border: 0
        }
      },

      '& .MuiFormHelperText-root': {
        textAlign: 'right',
        borderColor: '#C4C4C4',
        border: theme.spacing(1),
        borderTop: 0,
        borderLeft: 0,
        padding: '0 14px',
        margin: 0,
        borderRadius: theme.spacing(1)
      },

      '&:focus-visible': {
        outline: 'none'
      }
    }
  })
);
