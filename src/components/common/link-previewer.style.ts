import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: 150,
      fontSize: 10,
      color: 'black',
      position: 'absolute',
      zIndex: 100,
      bottom: 30,
      left: '50%',
      transform: 'translateX(-50%)',
    },
    linkWithPreview: {
      position: 'relative',
    },
    cardImgTop: {
      width: 150,
    },
    cardTitle: {
      fontSize: 14,
    },
  }),
);
