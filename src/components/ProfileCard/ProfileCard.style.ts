import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 312,
      marginBottom: 12,

      [theme.breakpoints.down('md')]: {
        maxWidth: 290,
      },

      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 35,
        left: 0,
        width: 8,
        height: 40,
        borderRadius: theme.spacing(0, 1.25, 1.25, 0),
        background: theme.palette.primary.main,
      },
    },
    box: {
      background: '#FFF',
      paddingBottom: theme.spacing(3),
      padding: '30px 28px',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      borderRadius: '0px 0px 20px 20px',
    },
    wallet: {
      marginTop: theme.spacing(1.5),
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
    },
    walletButton: {
      width: 'auto',
      background: '#F6F7FC',
      fontSize: '14px',
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
    },
    address: {
      width: '122px',
      padding: 10,
      textAlign: 'center',
      borderRadius: 20,
      height: 40,
      background: '#F6F7FC',
      fontSize: '14px',
      fontWeight: theme.typography.fontWeightRegular,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordWrap: 'break-word',
    },
  }),
);
