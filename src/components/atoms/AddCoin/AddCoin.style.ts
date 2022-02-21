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
        cursor: 'pointer',
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
    },
    header: {
      lineHeight: '20.08px',
      fontWeight: 400,
    },
    subHeader: {
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
