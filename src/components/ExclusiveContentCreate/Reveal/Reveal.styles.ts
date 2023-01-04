import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      border: '1px solid',
      borderColor: '#C2C2C2',
      padding: 10,
      borderRadius: 4,
      marginTop: 10,
    },
    textUnlock: {
      color: '#404040',
      fontSize: 14,
      marginTop: 10,
    },
    plain: {
      '& p': {
        marginBlockStart: 0,
        marginBlockEnd: 0,
      },
    },
  }),
);
