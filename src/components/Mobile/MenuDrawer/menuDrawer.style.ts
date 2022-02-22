import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#F6F7FC',
      position: 'fixed',
      overflow: 'auto',
      height: '100vh',
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
