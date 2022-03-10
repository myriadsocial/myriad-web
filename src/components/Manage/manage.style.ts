import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    secondaryAction: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    text: {
      textAlign: 'right',
    },
    input: {
      marginTop: theme.spacing(1),
      marginBottom: '0px',
      '& .MuiOutlinedInput-input': {
        padding: '12px 16px',
      },
    },
  }),
);
