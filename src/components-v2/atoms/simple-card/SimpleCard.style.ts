import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minWidth: 311,
      marginBottom: theme.spacing(1),
      /* Drop shadow */
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,

      '& .MuiCardActionArea-focusVisible': {
        backgroundColor: '#FFF',
      },

      '&:hover': {
        backgroundColor: '#FFF',
      },
    },
    activated: {
      border: `1px solid #6E3FC3`,
      boxSizing: `border-box`,
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
      flexDirection: 'row',
      '& > div:last-child': {
        marginLeft: 'auto',
      },
    },
    actionArea: {
      display: 'flex',
      '&:hover $focusHighlight': {
        opacity: 0,
      },
    },
    focusHighlight: {},
    iconButton: {
      flex: '1 0 auto',
      justifyContent: 'flex-end',
      paddingRight: theme.spacing(3.375),
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    staticContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:last-child': {
        padding: 0,
      },
    },
    content: {
      flex: '1 0 auto',
      alignSelf: 'center',
      paddingLeft: 0,
    },
    cover: {
      width: 68,
      height: 68,
      margin: 20,
      opacity: 0.9,
      borderRadius: 5,
    },
  }),
);

export default useStyles;
