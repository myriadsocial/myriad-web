import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

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
          <Typography component="span" onClick={handleClickOpen} className={style.decoration}>
            Myriad Demo Version
          </Typography>{' '}
          right now
        </Typography>
      </div>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title">
          <Typography className={`${style.span} ${style.center}`}>Myriad version</Typography>
        </DialogTitle>
        <DialogContent className={`${style.p3}`}>
          <div className={style.center}>
            <BannerImage />
          </div>
          <Typography className={`${style.paragraph} ${style.center} ${style.mb} ${style.primary}`}>
            Great Things Take Time
          </Typography>
          <Typography className={`${style.paragraph} ${style.mb}`}>
            This current demo isn't a fully functional product yet. We’re still working to
            connecting the blocks . This means you may stumble upon many changes and the occasional
            bug here and there.
          </Typography>
          <Typography className={`${style.paragraph} ${style.mb}`}>
            Feel free to click around, and don't forget to join our :
          </Typography>
          <div className={`${style.mb} ${style['flex-col']}`}>
            <Button
              className={`${style.button} ${style.mb}`}
              variant="outlined"
              color="primary"
              startIcon={<MailOutlineIcon />}
              disabled>
              Mailing list
            </Button>
            <Button
              className={style.button}
              variant="outlined"
              color="primary"
              startIcon={<SendOutlinedIcon />}
              disabled>
              Telegram group
            </Button>
          </div>
          <Typography className={`${style.paragraph} ${style.mb}`}>
            Contact us if you have any query, feedback, find some bug or just want to say hi.
            Anything from you will make this a better app, Thank you!
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BannerDemo;
