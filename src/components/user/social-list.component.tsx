import React, { useRef } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import { ConnectComponent } from '../connect/connect.component';

import { useShareSocial } from 'src/hooks/use-share-social';
import { SocialsEnum } from 'src/interfaces';
import { User } from 'src/interfaces/user';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    }
  })
);

type SocialListProps = {
  user: User;
};

export const SocialListComponent: React.FC<SocialListProps> = ({ user }) => {
  const classes = useStyles();

  const { shareOnTwitter, shareOnReddit, shareOnFacebook } = useShareSocial(user.id);
  const connectRef = useRef<React.ElementRef<typeof ConnectComponent>>(null);
  const connected: Record<SocialsEnum, boolean> = {
    [SocialsEnum.FACEBOOK]: false,
    [SocialsEnum.TWITTER]: false,
    [SocialsEnum.REDDIT]: false
  };

  const connectSocial = (social: SocialsEnum) => () => {
    if (!connected[social]) {
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
      <List
        subheader={<ListSubheader style={{ fontSize: 16, fontWeight: 500, color: '#000' }}>Link my social</ListSubheader>}
        className={classes.root}>
        <ListItem>
          <ListItemIcon>
            <FacebookIcon />
          </ListItemIcon>
          <ListItemText id="social-facebook" primary="Facebook" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={connectSocial(SocialsEnum.FACEBOOK)}
              checked={connected[SocialsEnum.FACEBOOK]}
              inputProps={{ 'aria-labelledby': 'social-list-item-facebook' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <TwitterIcon />
          </ListItemIcon>
          <ListItemText id="social-twitter" primary="Twitter" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={connectSocial(SocialsEnum.TWITTER)}
              checked={connected[SocialsEnum.TWITTER]}
              inputProps={{ 'aria-labelledby': 'social-list-item-twitter' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RedditIcon />
          </ListItemIcon>
          <ListItemText id="social-reddit" primary="Reddit" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={connectSocial(SocialsEnum.REDDIT)}
              checked={connected[SocialsEnum.REDDIT]}
              inputProps={{ 'aria-labelledby': 'social-list-item-reddit' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <ConnectComponent ref={connectRef} publicKey={user.id} verify={verifyShared} />
    </>
  );
};
