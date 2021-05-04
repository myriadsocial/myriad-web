import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { User } from 'next-auth';
import { signIn } from 'next-auth/client';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import ShowIf from '../common/show-if.component';
import ConnectComponent from '../connect/connect.component';
import LoginOverlayComponent from '../login/overlay.component';
import { useStyles } from './social.style';

import { WithAdditionalParams } from 'next-auth/_utils';
import { SocialsEnum } from 'src/interfaces';
import { LayoutFilterType } from 'src/interfaces/setting';

const typograpyProps = { style: { fontSize: 10, padding: '5px 0', fontWeight: 500 } };

type Props = {
  loggedIn?: boolean;
  user: WithAdditionalParams<User>;
  settings: Record<LayoutFilterType, boolean> & Record<SocialsEnum, boolean>;
  onChange: (key: LayoutFilterType | SocialsEnum, value: boolean) => void;
  toggleLogin: (open: boolean) => void;
};

const SocialComponent = ({ user, settings, onChange, toggleLogin }: Props) => {
  const style = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(['social']);

  const [connectOpened, openConnect] = useState(false);
  const [connected, setConnected] = useState<Record<SocialsEnum, boolean>>({
    [SocialsEnum.TWITTER]: false,
    [SocialsEnum.FACEBOOK]: false,
    [SocialsEnum.REDDIT]: false
  });
  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum | null>(null);
  const [twitter, setTwitter] = useState<string>('Link To Twitter');
  const [facebook, setFacebook] = useState<string>('Link To Facebook');
  const [reddit, setReddit] = useState<string>('Link To Reddit');
  const isAnonymous = user.anonymous as boolean;

  // check if redirected by social login
  useEffect(() => {
    if (cookies.connection) {
      setSelectedSocial(cookies.connection.provider);
      openConnect(cookies.connection.provider);
    }

    return removeCookie('connection');
  }, [cookies]);

  useEffect(() => {
    if (user.userCredentials) {
      //@ts-ignore
      const twitterCredential = user.userCredentials.find(item => item.platform === SocialsEnum.TWITTER);
      //@ts-ignore
      const facebookCredential = user.userCredentials.find(item => item.platform === SocialsEnum.FACEBOOK);
      //@ts-ignore
      const redditCredential = user.userCredentials.find(item => item.platform === SocialsEnum.REDDIT);

      if (twitterCredential) {
        setTwitter(twitterCredential.username);
        setConnected({
          ...connected,
          [SocialsEnum.TWITTER]: true
        });
      }

      if (facebookCredential) {
        setFacebook(facebookCredential.username);
        setConnected({
          ...connected,
          [SocialsEnum.FACEBOOK]: true
        });
      }

      if (redditCredential) {
        setReddit(redditCredential.username);
        setConnected({
          ...connected,
          [SocialsEnum.REDDIT]: true
        });
      }
    }
  }, [user]);

  const handleOpenConnect = (social: SocialsEnum) => {
    if (connected[social]) return;

    setCookie('connection', {
      provider: social
    });
    signIn(social, {
      redirect: false
    });
  };

  const handleCloseConnect = () => {
    openConnect(false);
  };

  const handleToggle = (value: SocialsEnum) => () => {
    onChange(value, !settings[value]);
  };

  return (
    <div className={style.root}>
      <List component="nav">
        <ListItem button disabled={connected.facebook} className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.FACEBOOK)}>
          <ListItemIcon className={style.icon}>
            <FacebookIcon className={style.facebook} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={typograpyProps} className={style.button}>
            <ShowIf condition={!user.anonymous}>
              <Typography variant="body2">{facebook}</Typography>
            </ShowIf>
          </ListItemText>
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color={connected.facebook ? 'primary' : 'secondary'}
              size="small"
              disabled={!connected.facebook}
              onChange={handleToggle(SocialsEnum.FACEBOOK)}
              checked={settings[SocialsEnum.FACEBOOK]}
              inputProps={{ 'aria-labelledby': 'switch-list-label-facebook' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button disabled={connected.twitter} className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.TWITTER)}>
          <ListItemIcon className={style.icon}>
            <TwitterIcon className={style.twitter} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={typograpyProps} className={style.button}>
            <ShowIf condition={!user.anonymous}>
              <Typography variant="body2">{twitter}</Typography>
            </ShowIf>
          </ListItemText>
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color={connected.twitter ? 'primary' : 'secondary'}
              size="small"
              disabled={!connected.twitter}
              onChange={handleToggle(SocialsEnum.TWITTER)}
              checked={settings[SocialsEnum.TWITTER]}
              inputProps={{ 'aria-labelledby': 'switch-list-label-twitter' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button disabled={connected.reddit} className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.REDDIT)}>
          <ListItemIcon className={style.icon}>
            <RedditIcon className={style.reddit} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={typograpyProps} className={style.button}>
            <ShowIf condition={!user.anonymous}>
              <Typography variant="body2">{reddit}</Typography>
            </ShowIf>
          </ListItemText>
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color={connected.reddit ? 'primary' : 'secondary'}
              size="small"
              disabled={!connected.reddit}
              onChange={handleToggle(SocialsEnum.REDDIT)}
              checked={settings[SocialsEnum.REDDIT]}
              inputProps={{ 'aria-labelledby': 'switch-list-label-reddit' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <ShowIf condition={isAnonymous}>
        <LoginOverlayComponent toggleLogin={toggleLogin} />
      </ShowIf>

      {selectedSocial && <ConnectComponent social={selectedSocial} user={user} open={connectOpened} handleClose={handleCloseConnect} />}
    </div>
  );
};

export default SocialComponent;
