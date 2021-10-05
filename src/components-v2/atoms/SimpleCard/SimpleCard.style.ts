import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      border: `1px solid #FFF`,
      boxSizing: `border-box`,
      borderRadius: 10,
      display: 'flex',
      minWidth: 311,
      '& .MuiCardActionArea-focusVisible': {backgroundColor: '#FFF'},
      '&:hover': {backgroundColor: '#FFF'},
      /* Drop shadow */
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
    },
    activated: {
      border: `1px solid #6E3FC3`,
    },
    indicator: {
      width: 8,
      borderBottomLeftRadius: 10,
      borderTopLeftRadius: 10,
      backgroundColor: 'inherit',
    },
    indicatorActivated: {
      backgroundColor: theme.palette.primary.main,
    },
    details: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardContent: {
      padding: '0 0 0 20',
    },
    actionArea: {
      '&:hover $focusHighlight': {
        opacity: 0,
      },
      padding: 20,
    },
    focusHighlight: {},
    iconButton: {},
    cover: {
      width: 68,
      height: 68,
      opacity: 0.9,
      borderRadius: 5,
    },
    menu: {
      borderRadius: '10px',
      marginTop: '8px',
    },
    delete: {
      color: '#FE3636',
    },
  }),
);

export default useStyles;
