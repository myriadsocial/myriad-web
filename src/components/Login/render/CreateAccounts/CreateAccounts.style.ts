import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      maxHeight: 'fit-content',
      width: 508,
      background: '#FFFFFF',
      borderRadius: 10,
      padding: 40,
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      '& .MuiFormHelperText-contained': {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    textEmail: {fontSize: 14, fontWeight: 600, marginLeft: 8, color: 'black'},
    textTitle: {fontSize: 16, color: 'black', fontWeight: 600},
    wrapperEmail: {
      display: 'flex',
      marginTop: 12,
      backgroundColor: '#F5F5F5',
      padding: 8,
      borderRadius: 4,
      marginBottom: 16,
    },
    wrapperInstance: {
      display: 'flex',
      padding: 8,
      backgroundColor: '#F5F5F5',
      borderRadius: 4,
      marginBottom: 24,
      marginTop: 12,
    },
    wrapperTextInstance: {marginLeft: 8, flex: 1},
    textSeeMore: {fontSize: 10, color: '#7342CC', fontWeight: 600, textAlign: 'right'},
    desc: {fontSize: 12, color: '#0A0A0A'},
    nameInstance: {fontSize: 14, fontWeight: 600, color: '#7342CC', marginBottom: 4},
    wrapperTextCharacter: {display: 'flex', justifyContent: 'space-between'},
    textCharacter: {fontSize: 12, color: '#757575'},
    wrapperForm: {marginBottom: 24},
    textSetUsername: {fontSize: 12, color: '#404040', marginBottom: 24},
    condition: {
      padding: theme.spacing(2, 0),
    },
    termControl: {
      marginBottom: 24,
      [theme.breakpoints.down('md')]: {
        marginBottom: 16,
      },
    },
    termCondition: {
      color: '#0A0A0A',
    },
    term: {
      fontWeight: 400,
      textDecoration: 'none',
      color: '#7342CC',
    },
    checkbox: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    count: {
      fontSize: 12,
      color: theme.palette.text.secondary,
      position: 'absolute',
      right: 0,
      bottom: 32,
    },
  }),
);
