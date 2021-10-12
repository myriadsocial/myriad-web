import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import theme from 'src/themes/light';

type ConfirmDialogProps = {
  title: string;
  description: string;
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  open,
  handleClose,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title">
      <DialogTitle style={{cursor: 'move'}} id="-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{color: theme.palette.primary.dark}}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
