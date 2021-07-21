import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#424242',
      color: '#E0E0E0',
    },
    item: {
      '&.Mui-selected': {
        backgroundImage: 'linear-gradient(to right, #E849BD, lightpink)',
        color: '#171717',
      },
    },
    header: {
      textAlign: 'center',
    },
    content: {
      padding: '0 8px',
      '&:last-child': {
        paddingBottom: theme.spacing(1.5),
      },
    },
    action: {
      textAlign: 'center',
    },
    normal: {},
    expand: {
      transform: 'rotate(180deg)',
    },
    more: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    show: {
      color: '#E849BD',
    },
  }),
);
