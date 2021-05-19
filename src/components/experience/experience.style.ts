import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%'
      //marginBottom: theme.spacing(2)
    },
    action: {
      paddingTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      background: theme.palette.background.paper,
      alignItems: 'center',
      '& button': {
        textTransform: 'capitalize',
        marginRight: theme.spacing(1),
        '&:last-item': {
          marginRight: 0
        }
      }
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    }
  })
);
