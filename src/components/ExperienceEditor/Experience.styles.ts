import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      ' .MuiAutocomplete-option[aria-selected="true"]': {
        background: 'none',
      },
      ' .MuiAutocomplete-option[data-focus="true"]': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
      ' .MuiAutocomplete-tag .MuiSvgIcon-root': {
        width: 14,
        height: 14,
      },

      ' .MuiFormHelperText-root': {
        marginLeft: 0,

        [theme.breakpoints.down('xs')]: {
          fontSize: 12,
        },
      },
    },
    root: {
      padding: 30,
      background: '#FFF',
      borderRadius: 10,
      marginBottom: 24,

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
    content: {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(3),
    },
    row1: {
      minWidth: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 8,
      gap: 8,
    },
    boxImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      border: '2px dashed #C2C2C2',
      backgroundColor: '#F5F5F5',
    },
    row2: {
      width: '100%',
      overflow: 'hidden',
      paddingTop: 8,
    },
    title: {
      marginBottom: 30,
      fontSize: theme.typography.h5.fontSize,
      fontWeight: 400,
    },
    preview: {
      marginBottom: 30,

      '& .MuiListItem-root:hover': {
        backgroundColor: alpha('#FFC857', 0.15),

        '&::before,&::after': {
          content: '""',
          position: 'absolute',
          width: 30,
          height: '100%',
          top: 0,
          backgroundColor: alpha('#FFC857', 0.15),
        },
        '&::before': {
          left: -30,
        },
        '&::after': {
          right: -30,
        },
      },
    },
    postTextContainer: {
      border: '1px solid #E5E5E5',
      width: '100%',
      padding: '20px',
      borderRadius: '5px',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: 36,
    },
    textPost: {
      fontWeight: 600,
      fontSize: 18,
    },
    textPostDetail: {
      fontWeight: 400,
      fontSize: 14,
      marginTop: 9,
    },
    label: {
      background: '#FFF',
      paddingLeft: 6,
      paddingRight: 6,
    },
    social: {
      color: theme.palette.primary.main,
    },
    people: {},
    removePeople: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    mb: {
      marginBottom: '10px',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 999,
      width: '100%',
      height: '100%',
      textAlign: 'center',
    },
    option: {
      width: '100%',
    },
    counter: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      color: '#898888',
    },
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px 20px 20px',
      },
    },
    fill: {
      fill: 'currentColor',
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    formControl: {
      marginBottom: 0,
    },
  }),
);
