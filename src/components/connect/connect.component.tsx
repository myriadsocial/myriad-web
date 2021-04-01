import React, { useRef } from 'react';

import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';

import { SocialsEnum } from '../../interfaces';
import DialogTitle from '../common/DialogTitle.component';
import LinkingTutorialComponent from '../common/LinkingTutorial.component';

export type Props = {
  open: boolean;
  social: SocialsEnum;
  handleClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    share: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      boxShadow: 'none'
    },
    purple: {
      backgroundColor: '#A942E9'
    },
    dark: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 8
    },
    info: {
      textTransform: 'none'
    },
    facebook: {
      color: '#3b5998',
      minWidth: 40
    }
  })
);

export default function ConnectComponent({ open, handleClose }: Props) {
  const classes = useStyles();
  const childRef = useRef<any>();

  const config = React.useMemo(
    () => ({
      step1: <Avatar className={classes.purple}>1</Avatar>,
      step2: <Avatar className={classes.purple}>2</Avatar>,
      copyTitle: <Typography variant="h6">Say Hi, Copy the message below and post it on your Facebook status.</Typography>,
      shareTitle: <Typography variant="h6">Share it publicly on Facebook</Typography>
    }),
    []
  );

  const message = 'Saying hi to #MyriadNetwork\n\nPublic Key: 13N2NpDg6kU1vAGuPv9MkTj4YsaDmf7BKyr3TTxhV5sFmuhd';

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <DialogTitle id="connect-social" onClose={handleClose}>
          {' '}
          Link Your Facebook Account
        </DialogTitle>
        <DialogContent dividers>
          <Card className={classes.card}>
            <CardHeader avatar={config.step1} title={config.copyTitle} />
            <CardContent>
              <TextField className={classes.dark} multiline variant="outlined" rows={6} fullWidth={true} value={message} />
            </CardContent>
          </Card>
          <Card className={classes.card}>
            <CardHeader avatar={config.step2} title={config.shareTitle} />
            <CardContent className={classes.share}>
              <Button variant="contained" size="large" startIcon={<FacebookIcon />} className={classes.facebook}>
                Share
              </Button>
            </CardContent>
          </Card>

          <Button
            onClick={() => {
              childRef.current.triggerLinkingTutorial();
            }}
            color="default"
            size="large"
            variant="contained"
            className={classes.info}
            fullWidth>
            Tell me more about linking my social media account
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} fullWidth={true} size="large" variant="contained" color="secondary">
            {' '}
            I'm done, thanks
          </Button>
        </DialogActions>
      </Dialog>

      <LinkingTutorialComponent ref={childRef} />
    </>
  );
}
