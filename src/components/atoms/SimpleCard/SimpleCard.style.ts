import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      border: `1px solid #FFF`,
      boxSizing: `border-box`,
      borderRadius: 10,
      display: 'flex',
      width: '100%',

      '& .MuiCardActionArea-focusVisible': {backgroundColor: '#FFF'},
      '&:hover': {backgroundColor: '#FFF'},
      /* Drop shadow */
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
    },
    activated: {
      border: `1px solid #6E3FC3`,
    },
    activatedRibbon: {
      width: 8,
      height: '100%',
      backgroundColor: '#6E3FC3',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      position: 'absolute',
      top: 0,
      left: 0,
    },
    indicator: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
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
      padding: '0px 0px 0px 20px',
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    actionArea: {
      '&:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
      padding: '20px 20px 20px 28px',
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
    'flex-center': {
      display: 'flex',
      justifyContent: 'center',
    },
    m1: {
      marginRight: theme.spacing(1.5),
    },
    error: {
      background: '#FE3636',
      color: '#FFF',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
  }),
);

export default useStyles;
