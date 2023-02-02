import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',

      '& .MuiSvgIcon-root': {
        color: '#404040',
      },
      '& .MuiListItem-button': {
        paddingLeft: theme.spacing(3.75),
        paddingRight: theme.spacing(3.75),
      },

      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),

        //'&::before,&::after': {
        //content: '""',
        //position: 'absolute',
        //width: 30,
        //height: 52,
        //top: 0,
        //backgroundColor: alpha('#FFC857', 0.15),
        //},
        //'&::before': {
        //left: -30,
        //},
        //'&::after': {
        //right: -30,
        //},
      },

      '&::before': {
        content: '""',
        position: 'absolute',
        top: 46,
        width: 10,
        height: 60,
        borderRadius: theme.spacing(0, 1.25, 1.25, 0),
        background: theme.palette.primary.main,
      },
    },
    head: {
      marginLeft: 30,
      marginTop: 30,
      marginBottom: 32,
      cursor: 'pointer',
    },
    instance: {
      marginBottom: '10px',
      padding: '0 30px',
    },
  }),
);
