import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 438,
      maxHeight: 580,

      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
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
    logo: {
      height: 12,
      width: 12,
      marginLeft: 8,
      marginTop: 4,
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
      maxHeight: 'fit-content',
      gap: '8px',
      marginBottom: theme.spacing(1.5),
      alignItems: 'center',
      //overflow: 'scroll',
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
    containerEmpty: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      background: '#FFF',
      height: 300,
      width: '100%',
    },
    emptyTitle: {
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: '12px',
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: '14px',
    },
  }),
);
