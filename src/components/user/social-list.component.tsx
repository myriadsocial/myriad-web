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

import { ConfirmDialog } from 'src/components/common/confirm-dialog.component';
import { useShareSocial } from 'src/hooks/use-share-social';
import { useUserHook } from 'src/hooks/use-user.hook';
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

type SocialListProps = {
  isAnonymous: boolean;
  user: ExtendedUser | null;
};

export const SocialListComponent: React.FC<SocialListProps> = ({ isAnonymous, user }) => {
  const classes = useStyles();

  const { isShared, verifyPublicKeyShared } = useShareSocial(user?.id);
  const { disconnectSocial } = useUserHook(user?.id);
  const [connecting, setConnecting] = useState(false);
  const [unlink, setUnlink] = useState<SocialsEnum | null>(null);

  const connectRef = useRef<React.ElementRef<typeof ConnectComponent>>(null);
  const connected: Record<SocialsEnum, boolean> = {
    [SocialsEnum.FACEBOOK]: false,
    [SocialsEnum.TWITTER]: false,
    [SocialsEnum.REDDIT]: false
  };

  useEffect(() => {
    if (!isShared) {
      toggleConnect();
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

  const toggleConnect = () => {
    setConnecting(!connecting);
  };

  const connectSocial = (social: SocialsEnum) => () => {
    if (!connected[social]) {
      setConnecting(true);
      connectRef.current?.openConnectForm(social);
    } else {
      setUnlink(social);
    }
  };

  const unlinkSocial = () => {
    if (unlink) {
      disconnectSocial(unlink);
      setUnlink(null);
    }
  };

  const verifyShared = (social: SocialsEnum, username: string) => {
    verifyPublicKeyShared(social, username);
  };

  return (
    <>
      <List
        id="social-list"
        subheader={<ListSubheader className={classes.subheader}>Claim social media accounts</ListSubheader>}
        className={classes.root}>
        <ListItem disabled={isAnonymous}>
          <ListItemIcon>
            <FacebookIcon className={classes.facebook} />
          </ListItemIcon>
          <ListItemText id="social-facebook" primary="Facebook" />
          <ListItemSecondaryAction>
            <IconButton onClick={connectSocial(SocialsEnum.FACEBOOK)} aria-label="social-list-item-facebook" size="medium">
              {connected[SocialsEnum.FACEBOOK] ? <CheckIcon /> : <AddIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem disabled={isAnonymous}>
          <ListItemIcon>
            <TwitterIcon className={classes.twitter} />
          </ListItemIcon>
          <ListItemText id="social-twitter" primary="Twitter" />
          <ListItemSecondaryAction>
            <IconButton onClick={connectSocial(SocialsEnum.TWITTER)} aria-label="social-list-item-twitter" size="medium">
              {connected[SocialsEnum.TWITTER] ? <CheckIcon /> : <AddIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem disabled={isAnonymous}>
          <ListItemIcon>
            <RedditIcon className={classes.reddit} />
          </ListItemIcon>
          <ListItemText id="social-reddit" primary="Reddit" />
          <ListItemSecondaryAction>
            <IconButton onClick={connectSocial(SocialsEnum.REDDIT)} aria-label="social-list-item-reddit" size="medium">
              {connected[SocialsEnum.REDDIT] ? <CheckIcon /> : <AddIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      {user && <ConnectComponent ref={connectRef} publicKey={user.id} verify={verifyShared} />}
      <ConnectSuccessComponent open={connecting && isShared} onClose={toggleConnect} />
      <ConfirmDialog
        open={unlink !== null}
        handleClose={() => setUnlink(null)}
        handleSubmit={unlinkSocial}
        title="Unlink social account"
        description={`Are you sure to remove ${unlink} account from myriad network?`}
      />
    </>
  );
};
