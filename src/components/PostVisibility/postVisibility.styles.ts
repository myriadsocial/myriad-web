import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 460,

      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      padding: 0,
      marginTop: 18,
      marginBottom: 20,

      '& .MuiListItem-container': {
        marginBottom: 8,
      },
      // TODO: create custom component for check list
      '& .MuiListItem-root': {
        height: 36,
        width: 'auto',
        padding: theme.spacing(1, 0),

        '&.Mui-selected': {
          fontWeight: 'bold',
          backgroundColor: alpha('#FFC857', 0.15),

          '&::before,&::after': {
            content: '""',
            position: 'absolute',
            width: 30,
            height: 36,
            top: 0,
            backgroundColor: alpha('#FFC857', 0.15),
          },
          '&::before': {
            left: -30,
            [theme.breakpoints.down('md')]: {
              left: -20,
              width: 20,
            },
          },
          '&::after': {
            right: -30,
            [theme.breakpoints.down('md')]: {
              right: -20,
              width: 20,
            },
          },
        },
      },

      '& .MuiListItemText-root': {
        margin: 0,
      },

      '& .MuiTypography-root': {
        lineHeight: '18px',
      },

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    description: {
      marginBottom: 0,

      '& .MuiFormHelperText-root': {
        position: 'absolute',
        bottom: 4,
        right: 0,
      },
    },
    info: {
      width: 400,
      marginBottom: theme.spacing(4),

      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    action: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    fontSize: {
      fontSize: '12px',
    },
  }),
);
