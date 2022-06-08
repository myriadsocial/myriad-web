import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 400,
      maxHeight: 600,

      [theme.breakpoints.down('md')]: {
        maxWidth: 286,
      },
      [theme.breakpoints.down('xs')]: {
        maxWidth: '100%',
      },
    },
    options: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 30,

      '& . MuiMenu-paper': {
        width: 170,
      },
      [theme.breakpoints.down('xs')]: {
        marginBottom: 0,
      },
    },
    selected: {
      marginLeft: 8,
      fontWeight: 600,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
    list: {
      height: 340,
      overflow: 'auto',
      '& .MuiListItem-root': {
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 12,
      },
    },
    action: {
      marginTop: 8,
      marginBottom: 24,
    },
    tip: {
      textAlign: 'right',
      display: 'flex',
      alignItems: 'flex-start',
    },
    logo: {
      height: 12,
      width: 12,
      marginLeft: 8,
      marginTop: 4,
    },
    menu: {
      padding: '14px 12px',
    },
    search: {
      height: '32px',
      border: 'solid grey 1px',
      borderRadius: 20,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      fontSize: 12,
      marginBottom: 12,
    },
    item: {
      '& .MuiListItem-root': {
        paddingTop: 0,
        paddingBottom: 0,
      },
      '& .MuiListItemAvatar-root': {
        marginRight: 8,
        minWidth: 12,
      },
      '& .MuiTypography-root': {
        fontSize: 12,
      },
    },
  }),
);
