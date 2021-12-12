import {makeStyles, Theme} from '@material-ui/core/styles';

import {VariantType} from 'notistack';

interface VariantProps {
  variant: VariantType;
}

const useStyles = makeStyles<Theme, VariantProps>(theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '344px !important',
    },
  },
  card: {
    backgroundColor: props =>
      props?.variant === 'success'
        ? '#47B881'
        : props?.variant === 'error'
        ? '#FE3333'
        : props?.variant === 'warning'
        ? '#FFD24D'
        : props?.variant === 'info'
        ? '#1070CA'
        : '#FFFFFF',
    width: '100%',
    paddingLeft: 15,
    borderRadius: 10,
  },
  cardInside: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 15,
  },
  typography: {
    fontWeight: 'normal',
  },
  icons: {
    marginLeft: 'auto',
  },
  iconLeft: {
    marginRight: '12px',
    fill: props =>
      props?.variant === 'success'
        ? '#47B881'
        : props?.variant === 'error'
        ? '#FE3333'
        : props?.variant === 'warning'
        ? '#FFD24D'
        : props?.variant === 'info'
        ? '#1070CA'
        : '#FFFFFF',
  },
  iconClose: {
    marginRight: '12px',
    fill: '#66788A',
  },
}));

export default useStyles;
