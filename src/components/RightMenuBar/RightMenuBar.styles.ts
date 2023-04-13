import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiBox-root': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    tabContainer: {
      display: 'flex',
      alignItems: 'center',
      columnGap: '8px',
      padding: '0 5px',
      width: '100%',
    },
  }),
);
