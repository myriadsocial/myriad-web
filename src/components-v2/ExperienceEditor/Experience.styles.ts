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
    },
    root: {
      padding: 30,
      background: '#FFF',
      borderRadius: 10,

      '& .MuiAutocomplete-popupIndicatorOpen': {
        transform: 'none',
      },

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
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
          height: 68,
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
  }),
);
