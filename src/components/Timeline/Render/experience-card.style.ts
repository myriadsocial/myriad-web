import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      minHeight: 100,
      marginBottom: 16,
      borderRadius: 10,
      padding: 16,
      display: 'flex',
      gap: 8,
    },
    content: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      width: '100%',
    },
  }),
);
