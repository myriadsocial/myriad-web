import {CheckCircleIcon} from '@heroicons/react/solid';
import {ExclamationCircleIcon} from '@heroicons/react/solid';
import {ExclamationIcon} from '@heroicons/react/solid';

import React, {useMemo} from 'react';

import {SvgIcon} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import {Prompt} from './prompt';
import {useStyles} from './prompt.style';

export const PromptComponent: React.FC<Prompt> = props => {
  const {open, title, subtitle, children, icon, onCancel} = props;

  const style = useStyles();

  const promptIcon = useMemo(() => {
    switch (icon) {
      case 'danger': {
        return ExclamationCircleIcon;
      }
      case 'warning': {
        return ExclamationIcon;
      }
      case 'success': {
        return CheckCircleIcon;
      }
    }
  }, [icon]);

  return (
    <Dialog
      className={style.root}
      onClose={onCancel}
      aria-labelledby="simple-dialog-title"
      open={open}>
      <DialogContent classes={{root: style.content}}>
        <div className={style.prompt}>
          <SvgIcon
            className={`${style.icon} ${style[icon]}`}
            classes={{root: style.fill}}
            component={promptIcon}
            viewBox="0 0 20 20"
          />
          <Typography variant="h4" className={style.title}>
            {title}
          </Typography>
          <Typography variant="body1" className={`${style.text} ${style['m-vertical1']}`}>
            {subtitle}
          </Typography>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

PromptComponent.defaultProps = {};
