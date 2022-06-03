import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#F6F7FC',
      position: 'fixed',
      overflow: 'auto',
      height: 'calc(var(--vh, 1vh) * 100)',
      width: '284px',
      zIndex: 99999,
      left: 0,
      top: 0,
    },
    content: {
      width: '100%',
    },
    profileCard: {
      borderRadius: '0px 0px 20px 20px;',
      padding: '28px 20px 20px 20px',
      background: '#FFF',
      width: '100%',
    },
    wallet: {
      marginTop: theme.spacing(-1),
      marginBottom: theme.spacing(2.5),
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
    },
    address: {
      width: '122px',
      padding: 10,
      textAlign: 'center',
      borderRadius: 20,
      height: 40,
      background: '#F6F7FC',
      fontSize: '14px',
      fontWeight: 400,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordWrap: 'break-word',
    },
    menu: {
      padding: '20px',
    },
    logout: {
      borderTop: '1px solid #DECCFF',
      paddingRight: '20px',
      marginBottom: '12px',
      paddingLeft: '20px',
      width: '100%',
      height: 52,
    },
    logoutListItem: {
      paddingLeft: 0,
    },
    icon: {
      marginRight: 20,
      minWidth: 24,
      padding: 6,
    },
    fill: {
      fill: 'currentColor',
      color: '#404040',
    },
  }),
);
