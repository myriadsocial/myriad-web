import {XIcon} from '@heroicons/react/outline';

import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';

import {ToasterProps, Status} from '.';

export const Toaster: React.FC<ToasterProps> = props => {
  const {toasterStatus, message, open, onClose} = props;
  const {palette, status} = useTheme();

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose();
  };

  const defineBG = (toasterStatus: string) => {
    switch (toasterStatus) {
      case Status.SUCCESS: {
        return status.success.main;
      }

      case Status.WARNING: {
        return palette.secondary.main;
      }

      case Status.DANGER: {
        return status.warning.main;
      }

      case Status.INFO: {
        return status.info.main;
      }

      default: {
        return palette.primary.main;
      }
    }
  };

  return (
    <div>
      <Snackbar open={open} onClose={handleClose}>
        <Paper
          style={{
            borderRadius: 10,
          }}>
          <div style={{display: 'flex'}}>
            <div
              style={{
                width: 8,
                borderBottomLeftRadius: 10,
                borderTopLeftRadius: 10,
                backgroundColor: defineBG(toasterStatus),
              }}></div>
            <div
              style={{
                display: 'flex',
                height: `100%`,
                padding: 0,
                margin: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Typography style={{marginLeft: 12}}>{message}</Typography>
              <IconButton aria-label="close" onClick={handleClose}>
                <SvgIcon component={XIcon} viewBox="0 0 24 24" />
              </IconButton>
            </div>
          </div>
        </Paper>
      </Snackbar>
    </div>
  );
};
