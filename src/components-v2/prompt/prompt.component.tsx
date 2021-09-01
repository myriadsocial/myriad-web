import {action} from '@storybook/addon-actions';

import React from 'react';

import {SvgIcon} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';

import {useStyles} from './prompt.style';

type Prompt = {
  togglePromt: () => void;
  open: boolean;
  variant?: 'sure' | 'careful' | 'success';
};

export const Prompt: React.FC<Prompt> = ({togglePromt, open, variant = 'careful'}) => {
  const style = useStyles();

  const Sure = () => {
    return (
      <div className={style.prompt}>
        <SvgIcon
          className={style.icon}
          style={{color: '#FFD24D'}}
          fontSize="inherit"
          color="inherit">
          <WarningIcon />
        </SvgIcon>
        <Typography variant="h5">Are you sure?</Typography>
        <Typography className={`${style.text} ${style['m-vertical1']}`} variant="body1">
          Experience deleted can’t be restored
        </Typography>
        <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
          <Button
            size="small"
            variant="outlined"
            onClick={action('Primary button clicked')}
            color="primary">
            No, keep experience
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={action('Primary button clicked')}
            color="primary">
            Yes, delete experience
          </Button>
        </div>
      </div>
    );
  };

  const Careful = () => {
    return (
      <div className={style.prompt}>
        <SvgIcon className={style.icon} fontSize="inherit" color="error">
          <ErrorIcon />
        </SvgIcon>
        <Typography variant="h5">Careful!</Typography>
        <Typography className={`${style.text} ${style['m-vertical1']}`} variant="body1">
          This action cannot be undone
        </Typography>
        <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
          <Button
            size="small"
            variant="outlined"
            onClick={action('Primary button clicked')}
            color="primary">
            No, let me rethink
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={action('Primary button clicked')}
            color="primary">
            Yes, proceed to delete
          </Button>
        </div>
      </div>
    );
  };

  const Success = () => {
    return (
      <div className={style.prompt}>
        <SvgIcon
          className={style.icon}
          style={{color: '#39BF87'}}
          fontSize="inherit"
          color="inherit">
          <CheckCircleIcon />
        </SvgIcon>
        <Typography variant="h5">Success!</Typography>
        <Typography className={`${style.text} ${style['m-vertical1']}`} variant="body1">
          Tip to Jenny Chang sent successfully
        </Typography>
        <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
          <Button
            size="small"
            variant="contained"
            onClick={action('Primary button clicked')}
            color="primary">
            Return
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      className={style.root}
      onClose={togglePromt}
      aria-labelledby="simple-dialog-title"
      open={open}>
      <DialogContent>
        {variant === 'careful' && Careful()}
        {variant === 'sure' && Sure()}
        {variant === 'success' && Success()}
      </DialogContent>
    </Dialog>
  );
};

Prompt.defaultProps = {};
