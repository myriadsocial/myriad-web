import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

//TODO: split this fx into sub-components
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    input: {
      marginBottom: 0,

      '& .MuiFormHelperText-root': {
        textAlign: 'center',
      },

      '&::before,&::after': {
        content: '""',
        position: 'absolute',
        height: 24,
        width: 85,
        top: 14,

        backgroundColor: '#FFD24D',
      },
      '&::before': {
        left: -85,
      },
      '&::after': {
        right: -85,
      },
    },
  }),
);
