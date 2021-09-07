import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
    action: {
      padding: 30,
    },
  }),
);
