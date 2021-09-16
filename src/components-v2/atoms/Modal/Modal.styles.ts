import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    title: {
      textAlign: 'center',
      padding: '30px 20px 20px 20px',

      '& .MuiTypography-h4': {
        fontWeight: 700,
        color: '#404040',
        marginBottom: theme.spacing(1),
      },
    },
    close: {
      position: 'absolute',
      right: 30,
      top: 30,

      '& .MuiSvgIcon-colorPrimary': {
        fill: 'none',
      },
    },
  }),
);
