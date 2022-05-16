import {XIcon} from '@heroicons/react/solid';

import React from 'react';

import {IconButton, SvgIcon, Typography} from '@material-ui/core';
import Dialog, {DialogProps} from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import {useStyles} from './Modal.styles';
import {AllignTitle, TitleSize} from './Modal.types';

export type ModalProps = DialogProps & {
  title: string;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
  align?: AllignTitle;
  titleSize?: TitleSize;
  gutter?: 'none' | 'default' | 'custom';
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = props => {
  const {
    title,
    subtitle,
    children,
    onClose,
    align = 'center',
    titleSize = 'medium',
    gutter = 'default',
    className,
    ...otherProps
  } = props;

  const styles = useStyles({align, titleSize, gutter});

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} {...otherProps} className={styles.root} disableEnforceFocus>
      <DialogTitle disableTypography className={[styles.title, className].join(' ')}>
        <Typography variant={titleSize === 'small' ? 'h5' : 'h4'}>{title}</Typography>
        {subtitle && (typeof subtitle === 'string' || subtitle instanceof String) ? (
          <Typography variant="subtitle1" display="block" className={styles.subtitle}>
            {subtitle}
          </Typography>
        ) : (
          <>{subtitle}</>
        )}
        <IconButton
          color="secondary"
          aria-label="close"
          size="small"
          className={styles.close}
          onClick={onClose}>
          <SvgIcon component={XIcon} color="primary" fontSize="medium" />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.content}> {children} </DialogContent>
    </Dialog>
  );
};
