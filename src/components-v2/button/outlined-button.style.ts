import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      // width: '180px',
      padding: '11px 20px',
      height: '40px',
      borderRadius: '20px',
      fontSize: '14px',
      outlineColor: 'red',
    },
    'button-cancel': {
      border: '2px solid #F0A200',
      color: '#000000',
    },
  }),
);
