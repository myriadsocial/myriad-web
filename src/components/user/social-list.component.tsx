import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import {ConnectSuccessComponent} from '../connect/connect-success.component';
import {ConnectComponent} from '../connect/connect.component';

import {ConfirmDialog} from 'src/components/common/confirm-dialog.component';
import {useShareSocial} from 'src/hooks/use-share-social';
import {useUserHook} from 'src/hooks/use-user.hook';
import {SocialsEnum} from 'src/interfaces';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    subheader: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    facebook: {
      color: '#3b5998',
      minWidth: 40,
    },
    twitter: {
      color: '#1DA1F2',
      minWidth: 40,
    },
    reddit: {
      color: '#FF5700',
      minWidth: 40,
    },
  }),
);

type SocialListProps = {
  isAnonymous: boolean;
};

export const SocialListComponent: React.FC<SocialListProps> = ({isAnonymous}) => {
  const classes = useStyles();

  const {user, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {isVerifying, isVerified, resetVerification, verifyPublicKeyShared} = useShareSocial();
  const {disconnectSocial} = useUserHook();
  const [selected, setSelected] = useState<SocialsEnum | null>(null);
  const [unlink, setUnlink] = useState<SocialsEnum | null>(null);

  const connectRef = useRef<React.ElementRef<typeof ConnectComponent>>(null);
  const connected: Record<SocialsEnum, boolean> = {
    [SocialsEnum.FACEBOOK]: false,
    [SocialsEnum.TWITTER]: false,
    [SocialsEnum.REDDIT]: false,
    [SocialsEnum.TELEGRAM]: false,
  };

  if (socials.length > 0) {
    const twitterCredential = socials.find(item => item.platform === SocialsEnum.TWITTER);
    const facebookCredential = socials.find(item => item.platform === SocialsEnum.FACEBOOK);
    const redditCredential = socials.find(item => item.platform === SocialsEnum.REDDIT);

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
    setSelected(null);
    resetVerification();
  };

  const connectSocial = (social: SocialsEnum) => () => {
    if (!connected[social]) {
      setSelected(social);
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
    verifyPublicKeyShared(social, username, () => {
      connectRef.current?.closeConnectForm();
    });
  };

  const disableForDemo = true;

  return (
    <>
      <List
        id="social-list"
        subheader={
          <ListSubheader className={classes.subheader}>Claim social media accounts</ListSubheader>
        }
        className={classes.root}>
        <Tooltip title={<h1 style={{color: 'white'}}>Coming soon</h1>} arrow>
          <ListItem disabled={disableForDemo ? true : isAnonymous}>
            <ListItemIcon>
              <FacebookIcon className={classes.facebook} />
            </ListItemIcon>
            <ListItemText id="social-facebook" primary="Facebook" />
            <ListItemSecondaryAction>
              <IconButton
                disabled={disableForDemo ? true : isAnonymous}
                onClick={connectSocial(SocialsEnum.FACEBOOK)}
                aria-label="social-list-item-facebook"
                size="medium">
                {connected[SocialsEnum.FACEBOOK] ? <CheckIcon /> : <AddIcon />}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Tooltip>
        <ListItem disabled={isAnonymous}>
          <ListItemIcon>
            <TwitterIcon className={classes.twitter} />
          </ListItemIcon>
          <ListItemText id="social-twitter" primary="Twitter" />
          <ListItemSecondaryAction>
            <IconButton
              disabled={isAnonymous}
              onClick={connectSocial(SocialsEnum.TWITTER)}
              aria-label="social-list-item-twitter"
              size="medium">
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
            <IconButton
              disabled={isAnonymous}
              onClick={connectSocial(SocialsEnum.REDDIT)}
              aria-label="social-list-item-reddit"
              size="medium">
              {connected[SocialsEnum.REDDIT] ? <CheckIcon /> : <AddIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      {user && (
        <ConnectComponent
          ref={connectRef}
          publicKey={user.id}
          verify={verifyShared}
          loading={isVerifying}
        />
      )}

      {isVerified && selected && (
        <ConnectSuccessComponent open={isVerified} social={selected} onClose={toggleConnect} />
      )}

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
