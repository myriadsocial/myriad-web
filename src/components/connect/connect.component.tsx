import React, { useRef, useMemo, useCallback } from 'react';
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
import TextField from '@material-ui/core/TextField';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import { SocialsEnum } from '../../interfaces';
import LinkingTutorialComponent from '../common/LinkingTutorial.component';
import ShowIf from '../common/show-if.component';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useShareSocial } from 'src/hooks/use-share-social';

export type Props = {
  open: boolean;
  social: SocialsEnum;
  user: WithAdditionalParams<User>;
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
    },
    twitter: {
      color: '#1DA1F2',
      minWidth: 40
    },
    reddit: {
      color: '#FF5700',
      minWidth: 40
    }
  })
);

const copy: Record<SocialsEnum, string> = {
  [SocialsEnum.TWITTER]: 'Say Hi, Copy the message below and post it on your Timeline.',
  [SocialsEnum.FACEBOOK]: 'Say Hi, Copy the message below and post it on your Facebook status.',
  [SocialsEnum.REDDIT]: 'Say Hi, Copy the message below and post it on Reddit.'
};

export default function ConnectComponent({ user, social, open, handleClose }: Props) {
  const classes = useStyles();
  const childRef = useRef<any>();
  const { shared, shareOnTwitter } = useShareSocial();

  const share = useCallback(() => {
    switch (social) {
      case SocialsEnum.TWITTER:
        shareOnTwitter();
        break;

      default:
        break;
    }
  }, [social]);

  const closeShare = () => {
    share();
    handleClose();
  };
  const config = useMemo(() => {
    return {
      step1: <Avatar className={classes.purple}>1</Avatar>,
      step2: <Avatar className={classes.purple}>2</Avatar>,
      copyTitle: <Typography variant="h6">{copy[social]}</Typography>,
      shareTitle: <Typography variant="h6">Share it publicly on {social}</Typography>
    };
  }, []);

  const message = `Saying hi to #MyriadNetwork\n\nPublic Key: ${user.address}`;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <DialogTitle id="connect-social">Link Your {social} Account</DialogTitle>
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
              <ShowIf condition={social === SocialsEnum.FACEBOOK}>
                <FacebookShareButton url="https://myriad-fe.herokuapp.com" quote={message}>
                  <Button variant="contained" size="large" onClick={share} startIcon={<FacebookIcon />} className={classes.facebook}>
                    Share
                  </Button>
                </FacebookShareButton>
              </ShowIf>

              <ShowIf condition={social === SocialsEnum.TWITTER}>
                <TwitterShareButton url="https://myriad-fe.herokuapp.com" title={message}>
                  <Button variant="contained" size="large" onClick={share} startIcon={<TwitterIcon />} className={classes.twitter}>
                    Share
                  </Button>
                </TwitterShareButton>
              </ShowIf>

              <ShowIf condition={social === SocialsEnum.REDDIT}>
                <RedditShareButton url="https://myriad-fe.herokuapp.com" title={message}>
                  <Button variant="contained" size="large" onClick={share} startIcon={<RedditIcon />} className={classes.reddit}>
                    Share
                  </Button>
                </RedditShareButton>
              </ShowIf>
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
          <Button onClick={closeShare} disabled={!shared} fullWidth={true} size="large" variant="contained" color="secondary">
            {' '}
            I'm done, thanks
          </Button>
        </DialogActions>
      </Dialog>

      <LinkingTutorialComponent ref={childRef} />
    </>
  );
}
