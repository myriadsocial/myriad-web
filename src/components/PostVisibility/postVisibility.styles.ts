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
          },
          '&::after': {
            right: -30,
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

      '& .MuiButton-root': {
        width: 180,
      },
    },
    fontSize: {
      fontSize: '12px',
    },
  }),
);
