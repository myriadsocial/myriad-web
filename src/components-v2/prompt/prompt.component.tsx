import {action} from '@storybook/addon-actions';

import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import {OutlinedButton as Button} from '../button/outlined-button.component.';
import {useStyles} from './prompt.style';

type Prompt = {
  togglePromt: () => void;
  open: boolean;
};

export const Prompt: React.FC<Prompt> = ({togglePromt, open}) => {
  const style = useStyles();
  return (
    <Dialog
      className={style.root}
      onClose={togglePromt}
      aria-labelledby="simple-dialog-title"
      open={open}>
      <DialogContent>
        <div className={style.prompt}>
          <Typography style={{color: 'red', marginTop: '10px'}} variant="h1">
            !
          </Typography>
          <Typography variant="h5">Careful!</Typography>
          <Typography className={style.text} variant="body1">
            This action cannot be undone
          </Typography>
          <div className={`${style['flex-center']} ${style['m-vertical1']}`}>
            <Button isCancel onClick={action('cancel')} label="No, let me rethink" />
            <Button onClick={action('proceed')} label="Yes, proceed to delete" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

Prompt.defaultProps = {};
