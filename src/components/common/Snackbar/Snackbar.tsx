import {
  ExclamationIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from '@heroicons/react/solid';

import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {SnackbarProps} from './Snackbar.interface';
import {useStyles} from './Snackbar.style';

import {useSnackbar, SnackbarContent} from 'notistack';

export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>((props, ref) => {
  const style = useStyles(props);

  const {closeSnackbar} = useSnackbar();
  const dismiss = () => closeSnackbar(props.key);

  return (
    <SnackbarContent ref={ref} className={style.root}>
      <div className={style.card}>
        <div className={style.cardInside}>
          <SvgIcon
            classes={{root: style.iconLeft}}
            component={
              props?.variant === 'success'
                ? CheckCircleIcon
                : props?.variant === 'error'
                ? ExclamationCircleIcon
                : props?.variant === 'warning'
                ? ExclamationIcon
                : props?.variant === 'info'
                ? InformationCircleIcon
                : QuestionMarkCircleIcon
            }
            viewBox="0 0 20 20"
          />
          <Typography variant="body1" className={style.typography} color="textPrimary">
            {props.message}
          </Typography>
          <div className={style.icons}>
            <IconButton aria-label="close" onClick={dismiss}>
              <SvgIcon
                component={XIcon}
                viewBox="0 0 20 20"
                classes={{root: style.iconClose}}
                color="inherit"
              />
            </IconButton>
          </div>
        </div>
      </div>
    </SnackbarContent>
  );
});

Snackbar.displayName = 'Snackbar';
