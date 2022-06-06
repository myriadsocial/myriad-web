import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
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
    box: {
      position: 'relative',
    },
    count: {
      fontSize: 12,
      color: theme.palette.text.secondary,
      position: 'absolute',
      right: 0,
      bottom: 32,
    },
    action: {
      marginTop: 80,
    },
    mobileRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mobileCard: {
      minWidth: 'fit-content',
      padding: 20,
      gap: 24,

      /* Neutral/10 */
      background: '#FFFFFF',

      /* Drop Shadow Card */
      boxShadow: `0px 6px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,

      /* Inside auto layout */
      flex: 'none',
      order: 1,
      flexGrow: 0,
    },
    logoWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '10vh',
      marginBottom: 20,
      rowGap: 8,
    },
    logo: {
      height: 48,
    },
    title: {
      marginBottom: 8,
      '& .MuiTypography-h5': {
        fontWeight: 600,
        color: '#0A0A0A',
      },
    },
    titlePrimary: {
      color: theme.palette.primary.main,
    },
    actionWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 8,
      marginTop: '10vw',
    },
  }),
);
