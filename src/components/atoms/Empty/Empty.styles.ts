import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {EmptyProps} from './Empty';

export const useStyles = makeStyles<Theme, EmptyProps>(theme =>
  createStyles({
    root: {
      background: '#FFF',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '335px',
      width: '100%',
    },
    title: {
      marginTop: props => (props.margin ? 54 : 0),
      fontWeight: 700,
      marginBottom: props => (props.margin ? 12 : 0),
    },
  }),
);
