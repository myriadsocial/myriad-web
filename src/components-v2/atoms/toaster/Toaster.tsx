import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {useTheme, createStyles, makeStyles} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import {ToasterProps, Status} from './';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperOnToaster: {
      boxSizing: 'border-box',
      width: '100%', //or any percentage width you want
      padding: 50,
    },
  }),
);

const Toaster = ({status, message}: ToasterProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>Open simple snackbar</Button>
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
                backgroundColor:
                  status === Status.SUCCESS
                    ? theme.status.success.main
                    : status === Status.WARNING
                    ? theme.status.warning.main
                    : status === Status.INFO
                    ? theme.status.info.main
                    : 'purple',
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
              <IconButton aria-label="close" style={{color: '#66788A'}} onClick={handleClose}>
                <SvgIcon
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </SvgIcon>
              </IconButton>
            </div>
          </div>
        </Paper>
      </Snackbar>
    </div>
  );
};

export default Toaster;
