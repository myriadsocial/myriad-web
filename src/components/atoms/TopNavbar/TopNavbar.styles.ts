import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {TopNavbarProps} from '.';

export const useStyles = makeStyles<Theme, TopNavbarProps>(theme =>
  createStyles({
    root: {
      background: '#FFFFFF',
      borderRadius: `0px 0px 10px 10px`,
      padding: theme.spacing(4.125, 3.75, 1.75, 3.75),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      columnGap: theme.spacing(2.125),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0, 4),
        borderRadius: `0px`,
        height: '56px',
      },
    },
    icon: {
      width: 20,
      position: 'relative',
      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        display: props => (props.type === 'menu' ? 'none' : ''),
        fontWeight: 500,
        color: '#404040',
      },
    },
    sectionTitle: {
      fontWeight: 700,
      fontSize: 20,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
        fontWeight: 500,
      },
    },
    description: {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
        fontWeight: 400,
      },
    },
    drawer: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: props => (props.type === 'menu' ? 'block' : ''),
      },
    },
  }),
);
