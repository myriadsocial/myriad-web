import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',

      '& > div': {
        marginRight: theme.spacing(2),
      },
    },
    section: {
      display: 'inline-block',
      marginLeft: '5px',
      marginRight: '5px',
    },
    action: {
      marginRight: theme.spacing(1),
      padding: 0,
    },
    text: {
      fontSize: '12px',
    },
  }),
);
