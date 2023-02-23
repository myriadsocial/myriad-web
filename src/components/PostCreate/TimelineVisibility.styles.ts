import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      background: '#FFF',
      borderRadius: 10,
      marginBottom: 24,
      transform: 'none',
      border: '1px solid #C2C2C2',
      '&:hover': {
        border: '1px solid #6E3FC3',
      },
      '& .MuiAutocomplete-popupIndicatorOpen': {
        transform: 'none',
      },

      [theme.breakpoints.down('xs')]: {
        padding: '20px',
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
    },
    image: {
      width: 68,
      height: 68,
      opacity: 0.9,
      borderRadius: 5,
    },
    cardAction: {
      padding: '10px 20px',
    },
    cardContent: {
      width: 140,
      padding: '0px 0px 0px 20px',
      flexGrow: 1,

      '&:last-child': {
        paddingBottom: 0,
      },
    },
    title: {
      wordBreak: 'break-word',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
      },
    },
    subtitle: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        fontWeight: 500,
      },
    },
    cardActive: {
      position: 'absolute',
      width: 12,
      height: '100%',
      left: 0,
      top: 0,
      backgroundColor: '#6E3FC3',
    },
  }),
);
