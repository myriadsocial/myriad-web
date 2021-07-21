import React from 'react';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      height: 56,
      padding: theme.spacing(2.5, 0),
      borderRadius: theme.spacing(1, 1, 0, 0),
      textAlign: 'center',
      boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%),0px 1px 1px 0px rgb(0 0 0 / 14%)',
      '&: .MuiTypography-root': {
        fontWeight: 700,
        lineHeight: '21px',
      },
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(3),
      top: theme.spacing(2),
      color: theme.palette.common.white,

      '& .MuiIconButton-label': {
        width: theme.spacing(3),
        height: theme.spacing(3),

        '& .MuiSvgIcon-root': {
          width: theme.spacing(3),
          height: theme.spacing(3),
        },
      },
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const {children, classes, onClose, ...other} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4">{children}</Typography>
      {onClose ? (
        <IconButton
          color="secondary"
          aria-label="close"
          size="small"
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default DialogTitle;
