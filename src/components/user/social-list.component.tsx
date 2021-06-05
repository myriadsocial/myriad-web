import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import { ConnectSuccessComponent } from '../connect/connect-success.component';
import { ConnectComponent } from '../connect/connect.component';

import { useShareSocial } from 'src/hooks/use-share-social';
import { SocialsEnum } from 'src/interfaces';
import { ExtendedUser } from 'src/interfaces/user';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    subheader: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.text.primary
    }
  })
);

type SocialListProps = {
  user: ExtendedUser;
};

export const SocialListComponent: React.FC<SocialListProps> = ({ user }) => {
  const classes = useStyles();

  const { isShared, shareOnTwitter, shareOnReddit, shareOnFacebook } = useShareSocial(user.id);
  const [connecting, setConnecting] = useState(false);
  const connectRef = useRef<React.ElementRef<typeof ConnectComponent>>(null);
  const connected: Record<SocialsEnum, boolean> = {
    [SocialsEnum.FACEBOOK]: false,
    [SocialsEnum.TWITTER]: false,
    [SocialsEnum.REDDIT]: false
  };

  useEffect(() => {
    if (!isShared) {
      setConnecting(false);
    }
  }, [isShared]);

  if (user && user.userCredentials.length > 0) {
    const twitterCredential = user.userCredentials.find(item => item.people.platform === SocialsEnum.TWITTER);
    const facebookCredential = user.userCredentials.find(item => item.people.platform === SocialsEnum.FACEBOOK);
    const redditCredential = user.userCredentials.find(item => item.people.platform === SocialsEnum.REDDIT);

    if (twitterCredential) {
      connected[SocialsEnum.TWITTER] = true;
    }

    if (facebookCredential) {
      connected[SocialsEnum.FACEBOOK] = true;
    }

    if (redditCredential) {
      connected[SocialsEnum.REDDIT] = true;
    }
  }

  const connectSocial = (social: SocialsEnum) => () => {
    if (!connected[social]) {
      setConnecting(true);
      connectRef.current?.openConnectForm(social);
    }
  };

  const verifyShared = (social: SocialsEnum, username: string) => {
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
  };

  return (
    <>
      <List subheader={<ListSubheader className={classes.subheader}>Link my social</ListSubheader>} className={classes.root}>
        <ListItem>
          <ListItemIcon>
            <FacebookIcon />
          </ListItemIcon>
          <ListItemText id="social-facebook" primary="Facebook" />
          <ListItemSecondaryAction>
            <IconButton onClick={connectSocial(SocialsEnum.FACEBOOK)} aria-label="social-list-item-facebook" size="medium">
              {connected[SocialsEnum.FACEBOOK] ? <CheckIcon /> : <AddIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <TwitterIcon />
          </ListItemIcon>
          <ListItemText id="social-twitter" primary="Twitter" />
          <ListItemSecondaryAction>
            <IconButton onClick={connectSocial(SocialsEnum.TWITTER)} aria-label="social-list-item-twitter" size="medium">
              {connected[SocialsEnum.TWITTER] ? <CheckIcon /> : <AddIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RedditIcon />
          </ListItemIcon>
          <ListItemText id="social-reddit" primary="Reddit" />
          <ListItemSecondaryAction>
            <IconButton onClick={connectSocial(SocialsEnum.REDDIT)} aria-label="social-list-item-reddit" size="medium">
              {connected[SocialsEnum.TWITTER] ? <CheckIcon /> : <AddIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <ConnectComponent ref={connectRef} publicKey={user.id} verify={verifyShared} />
      <ConnectSuccessComponent open={connecting && isShared} onClose={() => setConnecting(false)} />
    </>
  );
};
