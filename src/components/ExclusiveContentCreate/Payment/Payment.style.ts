import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonPayment: {
      borderRadius: 4,
      backgroundColor: '#6E3FC3',
      color: '#FFF',
      width: 'max-content',
      marginTop: 20,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    wrapperButtonFlex: {
      marginTop: 32,
      display: 'flex',
      justifyContent: 'space-between',
      gap: '8px',
    },
  }),
);
