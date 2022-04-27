import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {ProfileCardProps} from './ProfileCard.interfaces';

export const useStyles = makeStyles<Theme, ProfileCardProps>(theme =>
  createStyles({
    avatar: {
      width: 48,
      marginRight: 4,

      [theme.breakpoints.down('xs')]: {
        marginRight: 8,
      },
    },
    hover: {
      '&:hover': {
        cursor: props => {
          if (!props.anonymous) return 'pointer';
          return '';
        },
      },
    },
    identity: {
      maxWidth: 162,

      [theme.breakpoints.down('md')]: {
        maxWidth: 142,
      },

      '& .MuiTypography-h5': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordWrap: 'break-word',
      },
    },
    name: {
      [theme.breakpoints.down('xs')]: {
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: 16,
      },
    },
    username: {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
    notification: {
      width: 40,

      '& .MuiIconButton-root': {
        padding: 8,
      },
      '& .MuiBadge-dot': {
        backgroundColor: theme.status.danger.main,
      },
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
    },
    profileContent: {
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(3),
      },
    },
    modal: {
      width: '564px',
    },
    line: {
      height: '20px',
      background: theme.palette.text.secondary,
      width: '2px',
      display: 'inline-block',
      margin: '0px 8px',
    },
    purple: {
      background: theme.palette.primary.main,
      borderRadius: '10px',
      padding: theme.spacing(2),
      color: '#FFF',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    mt2: {
      marginTop: theme.spacing(2),
    },
    button: {
      width: 'auto',
      height: 'auto',
    },
  }),
);
