import React from 'react';

import {IconButton, Typography} from '@material-ui/core';
import Dialog, {DialogProps} from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/CloseOutlined';

import {useStyles} from './Modal.styles';

type ModalProps = DialogProps & {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = props => {
  const {title, subtitle, children, onClose, ...otherProps} = props;

  const styles = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} {...otherProps} className={styles.root}>
      <DialogTitle disableTypography className={styles.title}>
        <Typography variant="h4">{title}</Typography>
        {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
        <IconButton
          color="secondary"
          aria-label="close"
          size="small"
          className={styles.close}
          onClick={onClose}>
          <CloseIcon color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent> {children} </DialogContent>
    </Dialog>
  );
};
