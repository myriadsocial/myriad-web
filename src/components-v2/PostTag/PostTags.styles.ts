import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginBottom: 30,
    },
    title: {
      marginRight: 20,
      color: '#000000',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    list: {
      display: 'flex',

      '& .MuiListItem-root': {
        width: 'auto',
        border: '1px solid',
        borderColor: '#E5E5E5',
        borderRadius: 5,
        marginRight: theme.spacing(1),
        padding: theme.spacing(1, 1.5),

        '&.Mui-selected': {
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          borderColor: theme.palette.primary.main,
          background: 'transparent',
        },
      },

      '& .MuiListItemText-root': {
        margin: 0,
      },

      '& .MuiTypography-root': {
        lineHeight: '18px',
      },
    },
  }),
);
