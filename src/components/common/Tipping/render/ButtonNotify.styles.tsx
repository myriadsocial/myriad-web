import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 180,
    },
    twitter: {
      backgroundColor: '#1DA1F2',
      borderWidth: 0,
      color: '#FFFFFF',
      fontWeight: 600,
      lineHeight: '17.57px',
      '& rect': {
        fill: '#1DA1F2',
      },
      '&:hover': {
        backgroundColor: 'rgba(29, 161, 242, 1)',
      },
    },
    reddit: {
      backgroundColor: '#FF5722',
      borderWidth: 0,
      color: '#FFFFFF',
      fontWeight: 600,
      lineHeight: '17.57px',
      '& rect': {
        fill: '#FF5722',
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 87, 34, 1)',
      },
    },
  }),
);
