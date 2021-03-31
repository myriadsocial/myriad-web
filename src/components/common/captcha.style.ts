import { makeStyles } from '@material-ui/core/styles';

import theme from '../../themes/default';

export const useStyles = makeStyles({
  captcha: {
    margin: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
