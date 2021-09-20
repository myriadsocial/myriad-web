import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    tabs: {
      minHeight: 30,
      marginLeft: -30,
      marginRight: -30,
      borderBottom: '1px solid #E5E5E5',

      '& .MuiTabs-flexContainer': {
        justifyContent: 'space-evenly',
      },

      '& .MuiTab-wrapper': {
        textTransform: 'capitalize',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: '20px',
        maxWidth: 90,
        minWidth: 90,
      },

      '& .MuiTab-root': {
        minHeight: 30,
        maxWidth: 90,
        minWidth: 90,
      },

      '& .MuiTab-textColorInherit.Mui-selected': {
        fontWeight: 700,
      },
    },
    action: {
      padding: 30,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    option: {
      display: 'flex',
      alignItems: 'center',
    },
    nsfw: {
      color: theme.palette.text.secondary,
      width: 80,
      marginLeft: 30,
      marginRight: 30,
    },
  }),
);
