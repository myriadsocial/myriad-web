import {
  ExclamationIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from '@heroicons/react/solid';

import React, {forwardRef, useCallback} from 'react';

import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {ToasterSnackProps} from './toaster-snack.interface';
import useStyles from './toastersnack.style';

import {useSnackbar, SnackbarContent} from 'notistack';
import {useToasterHook} from 'src/hooks/use-toaster.hook';

export const ToasterSnack = forwardRef<HTMLDivElement, ToasterSnackProps>((props, ref) => {
  const style = useStyles(props);
  const {closeSnackbar} = useSnackbar();
  const {clearToaster} = useToasterHook();

  const handleDismiss = useCallback(() => {
    closeSnackbar(props.key);
    clearToaster();
  }, [props.key, closeSnackbar]);

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
          <Typography variant="subtitle2" className={style.typography} color="textPrimary">
            {props.message}
          </Typography>
          <div className={style.icons}>
            <IconButton aria-label="close" onClick={handleDismiss}>
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
