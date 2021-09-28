import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {width: 340},
    input: {
      width: '100%',
      height: '32px',
      border: 'solid grey 1px',
      borderRadius: '20px',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    hover: {
      '&:hover': {
        backgroundColor: 'rgba(255, 200, 87, 0.15)',
      },
    },
    fill: {
      fill: 'currentColor',
    },
    item: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
      '&:hover': {
        cursor: 'pointer',
      },
    },
    avatar: {
      width: 40,
      height: 40,
      marginRight: 16,
      background: '#E0E0E0',
    },
    header: {
      fontSize: '16px',
      lineHeight: '20.08px',
      fontWeight: 400,
    },
    subHeader: {
      fontSize: '12px',
      lineHeight: '15.06px',
      fontWeight: 400,
    },
    button: {
      marginTop: '31px',
    },
    selected: {
      background: '#FFC85726',
    },
  }),
);
