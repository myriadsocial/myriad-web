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
    markdown: {
      width: 120,
    },
    danger: {
      color: theme.status.warning.main,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
    danger: {
      color: theme.status.warning.main,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
    markdown: {
      width: 120,
    },
  }),
);
