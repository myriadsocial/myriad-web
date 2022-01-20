import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

import DialogTitle from 'src/components/common/DialogTitle.component';
import BannerImage from 'src/images/banner-image.svg';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      justifyContent: 'center',
      background: '#FED8D8',
      alignItems: 'center',
      color: '#F13838',
      display: 'flex',
      margin: 0,
    },
    paragraph: {
      letterSpacing: '0em',
      lineHeight: '28px',
      fontWeight: 400,
      color: '#4B4851',
      fontSize: 16,
    },
    center: {
      textAlign: 'center',
    },
    button: {
      borderRadius: theme.spacing(1),
      padding: theme.spacing(1),
      fontSize: 16,
      width: 207,
    },
    button2: {
      borderRadius: theme.spacing(1),
      padding: theme.spacing(1),
      fontSize: 16,
      width: 398,
    },
    'flex-col': {
      flexDirection: 'column',
      alignItems: 'center',
      display: 'flex',
    },
    mb: {
      marginBottom: theme.spacing(2),
    },
    mr: {
      marginRight: theme.spacing(1),
    },
    p3: {
      padding: theme.spacing(3),
    },
    span: {
      fontSize: 16,
    },
    decoration: {
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    primary: {
      fontWeight: 'bold',
      color: '#8629E9',
    },
    size: {
      width: '678px',
    },
  }),
);

const BannerDemo: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const style = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={style.root}>
        <InfoOutlinedIcon className={style.mr} />
        <Typography className={style.span} component="span">
          You’re on{' '}
          <Typography
            component="span"
            onClick={handleClickOpen}
            className={style.decoration}
            data-testid="show-banner">
            Myriad Demo v1.0.0
          </Typography>{' '}
          right now, not audited, use at your own risk!
        </Typography>
      </div>
      <Dialog fullWidth maxWidth="sm" open={open} aria-labelledby="dialog-title">
        <DialogTitle id="name" onClose={handleClose}>
          Myriad version
        </DialogTitle>
        <DialogContent className={`${style.p3}`}>
          <div className={style.center}>
            <BannerImage />
          </div>
          <Typography className={`${style.paragraph} ${style.center} ${style.mb} ${style.primary}`}>
            Great Things Take Time
          </Typography>
          <Typography className={`${style.paragraph} ${style.mb} ${style.center}`}>
            Welcome to the Myriad MVP (Minimum Viable Product)! The app you are currently viewing is
            still under heavy development and is not a fully functional product yet. We’re still
            working on connecting the blocks (blockchains?) which means the app will continuously
            change and you may come across the occasional bug. You can subscribe to our mailing list
            where we’ll keep you updated on the latest developments and when we’ve moved to the
            (hopefully) bug-free Alpha version.
          </Typography>
          <Typography className={`${style.paragraph} ${style.mb} ${style.center}`}>
            Feel free to click around, and don{"'"}t forget to join our:
          </Typography>
          <div className={`${style.mb} ${style['flex-col']}`}>
            <a href="https://t.me/myriadsocial" target="_blank" rel="noreferrer">
              <Button
                className={style.button}
                variant="outlined"
                color="primary"
                startIcon={<SendOutlinedIcon />}>
                Telegram channel
              </Button>
            </a>
          </div>
          <Typography className={`${style.paragraph} ${style.mb} ${style.center}`}>
            Contact us if you have any queries, feedback, bug reports or if you just want to say
            “Hi!”, we’d love to hear from you! Being a Web 3.0 Decentralized Application, any input
            from our beloved users will help us build a better app. Thank you!
          </Typography>
          <div className={`${style.center}`}>
            <Button
              onClick={handleClose}
              className={`${style.button2} ${style.center} ${style.mb}`}
              variant="contained"
              color="primary">
              Ok, Got it !!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BannerDemo;
