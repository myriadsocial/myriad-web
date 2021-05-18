import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { FacebookShareButton, RedditShareButton, TwitterShareButton } from 'react-share';

import { User } from 'next-auth';

import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { SocialsEnum } from '../../interfaces';
import LinkingTutorialComponent from '../common/LinkingTutorial.component';
import ShowIf from '../common/show-if.component';
import { useStyles } from './conntect.style';

import { WithAdditionalParams } from 'next-auth/_utils';
import DialogTitleCustom from 'src/components/common/DialogTitle.component';
import { useShareSocial } from 'src/hooks/use-share-social';

export type Props = {
  open: boolean;
  social: SocialsEnum;
  user: WithAdditionalParams<User>;
  handleClose: () => void;
};

const copy: Record<SocialsEnum, string> = {
  [SocialsEnum.TWITTER]: 'Say Hi, Copy the message below and post it on your Timeline.',
  [SocialsEnum.FACEBOOK]: 'Say Hi, Copy the message below and post it on your Facebook status.',
  [SocialsEnum.REDDIT]: 'Say Hi, Copy the message below and post it on Reddit.'
};

const prefix: Record<SocialsEnum, string> = {
  [SocialsEnum.TWITTER]: 'https://twitter.com/',
  [SocialsEnum.FACEBOOK]: 'https://www.facebook.com/',
  [SocialsEnum.REDDIT]: 'https://www.reddit.com/user/'
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ConnectComponent({ user, social, open, handleClose }: Props) {
  const classes = useStyles();
  const [nameOpened, setNameOpened] = useState(false);
  const [username, setUsername] = useState('');
  const childRef = useRef<any>();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { sharing, isShared, isUsed, shareOnTwitter, shareOnReddit, shareOnFacebook, resetSharedStatus } = useShareSocial(
    user.address as string
  );

  useEffect(() => {
    if (isUsed && sharing) {
      notifyAccountUsed();
    }

    if (!isShared && sharing) {
      notifyNotShared();
    }
  }, [isUsed, sharing, isShared]);

  const share = useCallback(
    (username: string) => {
      switch (social) {
        case SocialsEnum.TWITTER:
          shareOnTwitter(username);
          break;
        case SocialsEnum.REDDIT:
          shareOnReddit(username);
          break;
        case SocialsEnum.FACEBOOK:
          shareOnFacebook(username);
          break;
        default:
          break;
      }
    },
    [social]
  );

  const toggleNameForm = () => {
    setNameOpened(!nameOpened);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('target value is: ', e.target.value);
    const text = e.target.value;
    const name = text.substring(text.lastIndexOf('/') + 1);

    resetSharedStatus(false);
    setUsername(name);
  };

  const handlePasteValue = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');
    const name = text.substring(text.lastIndexOf('/') + 1);

    resetSharedStatus(false);
    setUsername(name);
  };

  const verifyFacebook = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // const iframeContainer = window.document.getElementsByClassName('fb_iframe_widget')[0];

    // const iframe = iframeContainer.getElementsByTagName('iframe');

    // console.log(iframe[0].contentWindow);
    // userContentWrapper
    // userContent

    const text = e.clipboardData.getData('Text');
    const name = text.replace(prefix.facebook, '');

    resetSharedStatus(false);
    setUsername(name);
  };

  const setShared = () => {
    resetSharedStatus(false);
    toggleNameForm();
    share(username);
  };

  const closeShare = () => {
    handleClose();
    resetSharedStatus(false);
    setUsername('');
  };

  const notifyAccountUsed = () => {
    setShowNotification(true);
    setNotificationMessage(`${username} already taken`);
  };

  const notifyNotShared = () => {
    setShowNotification(true);
    setNotificationMessage(`Post not found`);
  };

  const clearNotification = () => {
    resetSharedStatus(false);
    setShowNotification(false);
    setNotificationMessage('');
  };

  const config = useMemo(() => {
    return {
      step1: <Avatar className={classes.purple}>1</Avatar>,
      step2: <Avatar className={classes.purple}>2</Avatar>,
      copyTitle: <Typography variant="h6">{copy[social]}</Typography>,
      shareTitle: <Typography variant="h6">Share it publicly on {social}</Typography>,
      helperTextDone: <Typography variant="h6">The button above is activated after importing account on {social} is done</Typography>
    };
  }, []);

  const message = `I'm part of the Myriad ${user.address}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.myriad.systems';

  const helperTextCopyURL = 'Copy and paste the complete url of your account (e.g. https://twitter.com/myAccount)';

  const handleClickTutorial = () => {
    childRef.current.triggerLinkingTutorial();
  };

  return (
    <div>
      <Dialog open={open} maxWidth="md" onClose={handleClose} aria-labelledby="link-social-accounts-window">
        <DialogTitle id="connect-social">Link Your {social} Account</DialogTitle>
        <DialogContent dividers>
          <Card className={classes.card}>
            <CardHeader avatar={config.step1} title={config.copyTitle} />
            <CardContent>
              <TextField disabled className={classes.dark} multiline variant="outlined" rows={6} fullWidth={true} value={message} />
            </CardContent>
          </Card>
          <Card className={classes.card}>
            <CardHeader avatar={config.step2} title={config.shareTitle} />
            <CardContent className={classes.share}>
              <ShowIf condition={social === SocialsEnum.FACEBOOK}>
                <FacebookShareButton url={appUrl} quote={message} onShareWindowClose={toggleNameForm}>
                  <Button variant="contained" size="large" startIcon={<FacebookIcon />} className={classes.facebook}>
                    Share
                  </Button>
                </FacebookShareButton>
              </ShowIf>

              <ShowIf condition={social === SocialsEnum.TWITTER}>
                <TwitterShareButton url={appUrl} title={message} onShareWindowClose={toggleNameForm}>
                  <Button variant="contained" size="large" startIcon={<TwitterIcon />} className={classes.twitter}>
                    Share
                  </Button>
                </TwitterShareButton>
              </ShowIf>

              <ShowIf condition={social === SocialsEnum.REDDIT}>
                <RedditShareButton url={appUrl} title={message} onShareWindowClose={toggleNameForm}>
                  <Button variant="contained" size="large" startIcon={<RedditIcon />} className={classes.reddit}>
                    Share
                  </Button>
                </RedditShareButton>
              </ShowIf>
            </CardContent>
          </Card>

          <Button onClick={handleClickTutorial} color="default" size="large" variant="contained" className={classes.info} fullWidth>
            Tell me more about linking my social media account
          </Button>
        </DialogContent>
        <DialogActions className={classes.done}>
          <Button onClick={closeShare} disabled={!isShared} fullWidth={true} size="large" variant="contained" color="secondary">
            {' '}
            I'm done, thanks
          </Button>
          <ShowIf condition={!isShared}>
            <Typography className={classes.doneText}>{config.helperTextDone}</Typography>
          </ShowIf>
        </DialogActions>
      </Dialog>

      <Dialog open={nameOpened} onClose={toggleNameForm} maxWidth="sm" disableBackdropClick disableEscapeKeyDown>
        <DialogTitleCustom id="user-title" onClose={toggleNameForm}>
          {social !== SocialsEnum.FACEBOOK ? `Fill your username in ${social}` : 'Copy Facebook shared url to verify'}
        </DialogTitleCustom>
        <DialogContent className={classes.usernameForm}>
          <ShowIf condition={social !== SocialsEnum.FACEBOOK}>
            <TextField
              value={username}
              onChange={handleUsernameChange}
              onPaste={handlePasteValue}
              color="secondary"
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="text"
              id="username"
              InputProps={{
                startAdornment: <InputAdornment position="start">{prefix[social]}</InputAdornment>
              }}
            />
            <FormHelperText>{helperTextCopyURL}</FormHelperText>
          </ShowIf>
          <ShowIf condition={social === SocialsEnum.FACEBOOK}>
            <TextField
              value={username}
              onPaste={verifyFacebook}
              color="secondary"
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="posturl"
              label="Post Url"
              type="text"
              id="posturl"
              InputProps={{
                startAdornment: <InputAdornment position="start">{prefix[social]}</InputAdornment>
              }}
            />
            <FormHelperText>{helperTextCopyURL}</FormHelperText>
          </ShowIf>
        </DialogContent>
        <DialogActions className={classes.done}>
          <Button onClick={setShared} fullWidth={true} size="large" variant="contained" color="secondary">
            {' '}
            Verify
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={showNotification}
        autoHideDuration={6000}
        onClose={clearNotification}>
        <Alert severity="error">{notificationMessage}</Alert>
      </Snackbar>
      <LinkingTutorialComponent ref={childRef} />
    </div>
  );
}
