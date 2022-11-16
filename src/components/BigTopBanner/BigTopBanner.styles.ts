import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bannerRoot: {
      position: 'sticky',
      top: 0,
      left: 0,
      zIndex: 99,
      height: '77px',
      width: '100%',
      backgroundColor: '#7A3CEB',
    },
    bannerContainer: {
      height: '100%',
    },
    bannerWrap: {
      padding: '20px 30px',
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      [theme.breakpoints.down('xs')]: {
        padding: '20px 0px',
      },
    },
    bannerText: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#fff',
    },
    connectWalletButton: {
      color: '#fff',
      borderColor: '#fff',
    },
  }),
);

export default useStyles;
