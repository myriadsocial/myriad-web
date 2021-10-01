import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 311,
      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '35px',
        right: 0,
        width: 8,
        height: 40,
        borderRadius: theme.spacing(1.25, 0, 0, 1.25),
        background: theme.palette.primary.main,
      },
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
    box: {
      background: '#FFF',
      paddingBottom: '0px',
      padding: theme.spacing(3, 3.75),
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
    },
    text: {
      fontSize: '12px',
      '&:hover': {
        fontWeight: 600,
        cursor: 'pointer',
      },
    },
    textAlign: {
      textAlign: 'right',
    },
    downIconButton: {
      width: '100%',
      background: '#FFF',
      textAlign: 'center',
      borderBottomLeftRadius: theme.spacing(2.5),
      borderBottomRightRadius: theme.spacing(2.5),
      '&:hover': {
        cursor: 'pointer',
        background: 'rgba(255, 200, 87, 0.2)',
      },
    },
    gutters: {
      paddingLeft: '30px',
      paddingRight: '30px',
    },
    hover: {
      '&:hover': {
        background: 'rgba(255, 200, 87, 0.2)',
      },
    },
    content: {
      width: '100%',
      background: '#FFF',
    },
    open: {
      height: 'auto',
      maxHeight: '9999px',
      transition: 'all 0.5s cubic-bezier(1,0,1,0)',
    },
    close: {
      maxHeight: 0,
      overflow: 'hidden',
      transition: 'all 0.5s cubic-bezier(0,1,0,1)',
    },
  }),
);

export default useStyles;
