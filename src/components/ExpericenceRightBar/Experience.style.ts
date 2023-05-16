import {
  alpha,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';

type ExperienceStyleProps = {
  selected: boolean;
  selectable: boolean;
  menuDrawer: boolean;
};

export const useStyles = makeStyles<Theme, ExperienceStyleProps>(theme =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      border: '1px solid',
      borderColor: props => (props.selected ? '#6E3FC3' : '#FFF'),
      borderRadius: 10,
      padding: props => (props.menuDrawer ? '5px 10px' : 20),
      width: '100%',
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      position: 'relative',

      '&:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
        borderColor: props => (props.selected ? '#6E3FC3' : 'transparent'),

        '& .MuiCardActionArea-focusHighlight': {
          opacity: 0,
        },

        '&::before': {
          backgroundColor: props =>
            props.selected ? '#6E3FC3' : 'transparent',
        },
      },

      '&::before': {
        content: '""',
        position: 'absolute',
        width: 8,
        top: 0,
        left: 0,
        height: '100%',
        backgroundColor: props => (props.selected ? '#6E3FC3' : '#FFF'),
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
      },
    },
    image: {
      width: props => (props.menuDrawer ? 40 : 68),
      height: props => (props.menuDrawer ? 40 : 68),
      opacity: 0.9,
      borderRadius: 5,
    },
    cardContent: {
      width: 140,
      padding: '0px 0px 0px 20px',
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',

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
    icon: {
      [theme.breakpoints.down('xs')]: {
        color: '#404040',
      },
    },
    menu: {
      borderRadius: 10,
      marginTop: 8,
    },
    delete: {
      color: '#FE3636',
    },
    error: {
      background: '#FE3636',
      color: '#FFF',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    modal: {
      paddingBottom: 10,
    },
    input: {
      width: 560,
      marginBottom: 0,
      marginTop: 10,

      '& .MuiInputLabel-root, .MuiInputBase-root': {
        color: '#616161',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    newPost: {
      backgroundColor: '#FE3333',
      display: 'flex',
      width: 20,
      height: 20,
      borderRadius: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '10px',
      color: '#FFF',
    },
  }),
);
