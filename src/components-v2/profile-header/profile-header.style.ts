import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 311,
      height: 110,

      '& .MuiSvgIcon-root': {
        fill: 'none',
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '35%',
        right: 0,
        width: 8,
        height: 40,
        borderRadius: theme.spacing(1.25, 0, 0, 1.25),
        background: theme.palette.primary.main,
      },
    },

    vectorDownIconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    secondRoot: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },

    iconButtonWrapper: {
      position: 'absolute',
      left: 0,
      paddingLeft: 15,
    },

    customAvatarWrapper: {
      padding: 12,
    },
  }),
);

export default useStyles;
