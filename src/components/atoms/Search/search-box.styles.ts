import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import {SearchBoxProps} from '.';

export const useStyles = makeStyles<Theme, SearchBoxProps>(theme =>
  createStyles({
    root: {
      padding: '2px 4px',
      height: 52,
      borderRadius: 10,
      border: props => (props.outlined ? '1px solid #EDEDED' : 'none'),

      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);
