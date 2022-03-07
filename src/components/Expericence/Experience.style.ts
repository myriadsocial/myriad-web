import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type ExperienceStyleProps = {
  selected: boolean;
  selectable: boolean;
};

export const useStyles = makeStyles<Theme, ExperienceStyleProps>(theme =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      border: '1px solid',
      borderColor: props => (props.selected ? '#6E3FC3' : '#FFF'),
      borderRadius: 10,
      padding: 20,
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
          backgroundColor: props => (props.selected ? '#6E3FC3' : 'transparent'),
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
      width: 68,
      height: 68,
      opacity: 0.9,
      borderRadius: 5,
    },
    cardContent: {
      padding: '0px 0px 0px 20px',
      flexGrow: 1,

      '&:last-child': {
        paddingBottom: 0,
      },
    },
    title: {
      wordBreak: 'break-word',
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
      },
    },
    subtitle: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        fontWeight: theme.typography.fontWeightMedium,
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
  }),
);
