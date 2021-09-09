import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme, {variant: 'row' | 'column'}>(() =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    icon: {
      display: 'flex',
      flexDirection: props => props.variant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    action: {
      padding: 0,

      '& .MuiSvgIcon-fontSizeLarge': {
        fontSize: 32,
      },
    },
  }),
);
