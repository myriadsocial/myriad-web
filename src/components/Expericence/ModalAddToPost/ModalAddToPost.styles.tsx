import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 438,
      maxHeight: 580,
    },
    subtitle: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
    fill: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    selected: {
      marginLeft: 4,
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
    info: {
      padding: 0,
      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
    },
    flex: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      marginBottom: theme.spacing(0.5),
    },
    experienceList: {
      maxHeight: '329px',
      gap: '8px',
      marginBottom: theme.spacing(1.5),
      alignItems: 'center',
      overflow: 'scroll',
    },
    experienceCard: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(2.5),
    },
    image: {
      width: 68,
      height: 68,
      opacity: 0.9,
      borderRadius: 5,
    },
    cardContent: {
      padding: '0px 0px 0px 20px',
      flexGrow: 1,

      '&:last-child': {
        paddingBottom: 0,
      },
    },
    title: {
      wordBreak: 'break-word',
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
      },
    },
  }),
);
