import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      ' .MuiAutocomplete-option[data-focus="true"]': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    root: {
      padding: 30,
      background: '#FFF',
      borderRadius: 10,

      '& .MuiAutocomplete-popupIndicatorOpen': {
        transform: 'none',
      },
    },
    title: {
      marginBottom: 30,
      fontSize: theme.typography.h5.fontSize,
      fontWeight: 400,
    },
    preview: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',

      '& > img': {
        marginBottom: 30,
        width: 80,
        height: 80,
      },
    },
    people: {},
  }),
);
