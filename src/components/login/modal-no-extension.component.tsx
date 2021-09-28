import React from 'react';

import getConfig from 'next/config';

import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import WarningIcon from '@material-ui/icons/Warning';

import DialogTitle from '../../components/common/DialogTitle.component';

const {publicRuntimeConfig} = getConfig();

const APP_NAME = publicRuntimeConfig.appName;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    wrapper: {
      width: 400,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    icon: {
      width: 54,
      height: 48,
      color: theme.palette.error.main,
    },
    header: {
      padding: 16,
      textAlign: 'center',
    },
    content: {
      padding: 8,
      width: 280,
      textAlign: 'center',
      lineHeight: '24px',
    },
    polkadot: {
      color: 'rgb(255, 140, 0)',
    },
    myriad: {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 24,
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      fontSize: 10,
      color: '#BCBCBC',
    },
    buttonGroup: {
      width: '100%',
      padding: theme.spacing(2),
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',

      '& .MuiButton-contained': {
        background: theme.palette.background.paper,
        fontSize: 16,
        fontWeight: 600,
        color: theme.palette.secondary.main,
        width: 150,
      },
    },
  }),
);

type NoExtensionComponentProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NoExtensionComponent: React.FC<NoExtensionComponentProps> = ({isOpen, onClose}) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Dialog open={isOpen} maxWidth="sm">
        <DialogTitle onClose={onClose} id="link-account">
          Sign In Error
        </DialogTitle>

        <DialogContent className={style.wrapper}>
          <div className={style.header}>
            <WarningIcon className={style.icon} />
            <Typography variant="h4" color="error">
              Extension Not Found
            </Typography>
          </div>

          <div className={style.content}>
            <Typography style={{fontSize: 16, fontWeight: 400}}>
              You need to download and install{' '}
              <Link
                href="https://polkadot.js.org/extension"
                target="_blank"
                className={style.polkadot}>
                Polkadot.js
              </Link>{' '}
              extension on your browser before sign in
            </Typography>
          </div>

          <div className={style.content}>
            <Typography style={{fontSize: 16, fontWeight: 400}}>
              If you already installed the extension, make sure you allow website access to &nbsp;
              <span className={style.myriad}>{APP_NAME}</span>.
            </Typography>
          </div>

          <div className={style.buttonGroup}>
            <Button
              style={{color: 'rgb(255, 140, 0)'}}
              variant="contained"
              size="medium"
              href="https://polkadot.js.org/extension"
              target="_blank">
              Polkadot.js
            </Button>
            <Button variant="contained" size="medium" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>

        <DialogActions className={style.actions}>
          <Link component="button" variant="h5">
            Privacy Policy
          </Link>
          <FiberManualRecordIcon className={style.circle} />
          <Link component="button" variant="h5">
            Term of Use
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};
