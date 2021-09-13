import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: '#F6F7FC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rootHeader: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      rowGap: theme.spacing(3),
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(3.75),
    },
    myriadLogoWrapper: {
      width: 155.71,
      height: 36,
    },
    rootContainer: {
      minWidth: 480,
      minHeight: 566,
      padding: theme.spacing(3.75),
      display: 'flex',
      flexDirection: 'column',
      '& .MuiTextField-root': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginLeft: 'unset',
        width: '100%',
      },
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: `10px 10px 0px 0px`,
    },
    secondFormField: {
      display: 'flex',
      flexDirection: 'inherit',
      rowGap: theme.spacing(1.125),
    },
    formActionWrapper: {
      marginTop: 'auto',
    },
    formAction: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
);
