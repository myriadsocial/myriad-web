import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

type ProfileBannedStyleProps = {
  background?: string;
};

export const useStyles = makeStyles<Theme, ProfileBannedStyleProps>(theme =>
  createStyles({
    root: {},
    avatar: {
      boxSizing: 'border-box',
      border: '2px solid #E5E5E5',
      width: theme.spacing(10),
      height: theme.spacing(10),
      marginRight: 20,
      fontSize: 30,
      [theme.breakpoints.down('xs')]: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    name: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '0em',
      [theme.breakpoints.down('xs')]: {
        fontWeight: 500,
        fontSize: 14,
        marginBottom: 0,
      },
    },
    username: {
      fontSize: 14,
      fontWeight: 300,
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
    header: {
      padding: 20,
      height: 240,
      background: '#757575',
      borderRadius: '10px 10px 0px 0px',
      marginBottom: 20,
    },
    content: {
      background: '#FFFFFF',
      borderRadius: 10,
      boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.05)',
      textAlign: 'center',
      height: 290,
    },
  }),
);
