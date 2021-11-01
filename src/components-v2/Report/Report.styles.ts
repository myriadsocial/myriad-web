import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 460,
    },
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      padding: 0,
      marginTop: 18,
      marginBottom: 20,

      '& .MuiListItem-root': {
        height: 36,
        width: 'auto',
        marginBottom: theme.spacing(1),
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
    info: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  }),
);
