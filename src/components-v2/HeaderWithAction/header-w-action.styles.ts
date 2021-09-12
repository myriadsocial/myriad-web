import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    actionText: {
      fontFamily: ['Mulish', 'serif'].join(','),
      fontWeight: theme.typography.fontWeightMedium,
    },
  }),
);
