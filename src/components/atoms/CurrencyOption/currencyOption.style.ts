import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '200px',
      borderRadius: '10px',
      marginLeft: '-20px',
    },
    header: {
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '6px 16px',
    },
    tokenColumn: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    text: {
      fontWeight: 400,
      fontSize: '12px',
      marginRight: 10,
    },
    input: {
      width: '160px',
      height: '32px',
      border: 'solid grey 1px',
      borderRadius: '20px',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      marginTop: '6px',
    },
    hover: {
      '&:hover': {
        backgroundColor: 'rgba(255, 200, 87, 0.15)',
      },
    },
    fill: {
      fill: 'currentColor',
    },
  }),
);
