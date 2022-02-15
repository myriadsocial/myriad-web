import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 508,
      padding: 30,
      background: '#FFFFFF',
      borderRadius: 10,
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
    },
    wrapper: {
      marginBottom: 8,
    },
    title: {
      marginBottom: 8,
      '& .MuiTypography-h5': {
        fontWeight: 600,
        color: '#0A0A0A',
      },
    },
    list: {
      display: 'flex',
      boxSizing: 'border-box',

      '& .MuiListItem-root': {
        display: 'block',
        boxSizing: 'border-box',
        paddingLeft: 2,
        paddingRight: 2,
      },
      '& .Mui-selected': {
        border: '1px solid #6E3FC3',
        borderRadius: 10,
        backgroundColor: 'inherit',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 1,
        paddingRight: 1,
      },
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
      cursor: 'pointer',
    },
    icon: {
      width: 80,
      fontSize: 32,
      marginBottom: 8,
    },
    condition: {
      padding: theme.spacing(2, 0),
    },
    termControl: {
      marginBottom: 24,
    },
    term: {
      fontWeight: 400,
      textDecoration: 'none',
    },
    checkbox: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
  }),
);
