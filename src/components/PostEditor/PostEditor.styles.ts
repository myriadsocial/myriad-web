import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 840,
      background: '#FFF',
      border: '1px solid #F6F6F6',
      borderRadius: 10,

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },

      [theme.breakpoints.down('xs')]: {
        width: '100%',
        '& .slate-ToolbarButton:not(.slate-ToolbarButton-active):hover': {
          color: 'inherit!important',
        },
      },
    },
    header: {
      padding: '12px 24px!important',
      background: '#F6F6F6',
      marginLeft: '0!important',
      marginRight: '0!important',
      marginBottom: '0!important',
      border: '1px solid #F6F6F6',
      borderRadius: theme.spacing(1.25, 1.25, 0, 0),
    },
    wrapper: {
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        minHeight: 'calc(100vh - 290px)',
      },
    },
    limit: {
      position: 'absolute',
      right: 8,
      bottom: 8,
    },
  }),
);
