import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
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
    textSign: {fontSize: 18, fontWeight: 'bold', color: 'black', textAlign: 'center'},
    textSubtitle: {fontSize: 14, fontWeight: 'normal', color: 'black', textAlign: 'center'},
    card: {
      padding: 10,
      borderColor: '#E0E0E0',
      border: 'solid grey 1px',
      borderRadius: 10,
      backgroundColor: 'white',
      height: 108,
      width: 108,
    },
    cardSelected: {
      padding: 10,
      borderColor: '#6E3FC3',
      border: 'solid grey 1px',
      borderRadius: 10,
      backgroundColor: 'white',
      height: 108,
      width: 108,
    },
    wrapperCard: {height: 108, width: 108},
    textMethod: {fontSize: 12, fontWeight: 600, color: 'black'},
    description: {
      textAlign: 'center',
      fontSize: 10,
      color: 'black',
      fontWeight: 600,
      marginTop: 10,
    },
    wrapperButton: {border: 0, background: 'white'},
    wrapperTooltip: {display: 'flex', alignItems: 'center', justifyContent: 'center'},
    wrapperCards: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
      marginBottom: 67,
    },
    tooltip: {color: '#DECCFF'},
    textOr: {fontSize: 14, color: 'black', marginLeft: 12, marginRight: 12},
  }),
);
