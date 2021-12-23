import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '20px 0',
      width: '100%',
      '& .MuiBox-root': {
        paddingLeft: 0,
        paddingRight: 24,
        paddingTop: 24,
        paddingBottom: 24,
      },
    },
    actionText: {
      fontFamily: ['Mulish', 'serif'].join(','),
      fontWeight: theme.typography.fontWeightMedium,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }),
);
