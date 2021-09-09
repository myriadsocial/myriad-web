import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    content: {
      padding: theme.spacing(0.5, 2.5),
    },
    tags: {
      marginBottom: theme.spacing(1.5),
    },
    action: {
      padding: theme.spacing(1.25, 2.5),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tabs: {
      borderBottom: '1px solid #E5E5E5',

      '& .MuiTabs-flexContainer': {
        justifyContent: 'space-evenly',
      },

      '& .MuiTab-wrapper': {
        textTransform: 'capitalize',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: '20px',
      },
    },
  }),
);
