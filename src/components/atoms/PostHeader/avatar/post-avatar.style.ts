import {makeStyles, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    avatar: {
      width: '48px',
      height: '48px',
    },
    facebook: {
      '& .MuiBadge-badge': {
        backgroundColor: '#3b5998',
      },
    },
    twitter: {
      '& .MuiBadge-badge': {
        backgroundColor: '#1DA1F2',
      },
    },
    reddit: {
      '& .MuiBadge-badge': {
        backgroundColor: '#FF4500',
      },
    },
    myriad: {
      '& .MuiBadge-badge': {
        backgroundColor: '#8629E9',
      },
    },
    action: {
      padding: 0,

      '& .MuiBadge-badge': {
        overflow: 'hidden',
        border: 'none',
      },
    },
  }),
);
