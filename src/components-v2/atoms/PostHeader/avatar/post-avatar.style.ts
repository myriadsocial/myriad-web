import {makeStyles, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    avatar: {
      width: 50,
      height: 50,
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
        backgroundColor: '#FF5700',
      },
    },
    myriad: {
      '& .MuiBadge-badge': {
        backgroundColor: '#8629E9',
        overflow: 'hidden',
      },
    },
    action: {
      padding: 0,
    },
  }),
);
