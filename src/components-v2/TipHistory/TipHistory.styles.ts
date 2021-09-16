import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 400,
    },
    options: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 30,

      '& . MuiMenu-paper': {
        width: 170,
      },
    },
    list: {
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
