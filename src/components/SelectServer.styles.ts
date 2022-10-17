import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 8,
    },
    formControl: {
      width: '250px',
      height: '40px',
    },
    select: {
      background: '#F6F7FC',
      borderRadius: '40px',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    icon: {
      fill: theme.palette.primary.main,
    },
    right: {
      position: 'absolute',
      right: 10,
      cursor: 'pointer',
    },
  }),
);

export default useStyles;
