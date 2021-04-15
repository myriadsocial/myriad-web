import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { User } from 'next-auth';
import { useSession, signIn } from 'next-auth/client';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import { SocialsEnum } from '../../interfaces';
import ShowIf from '../common/show-if.component';
import ConnectComponent from '../connect/connect.component';
import LoginOverlayComponent from '../login/overlay.component';
import { useStyles } from './social.style';

import { WithAdditionalParams } from 'next-auth/_utils';

const typograpyProps = { style: { fontSize: 10, padding: '5px 0', fontWeight: 500 } };

type Props = {
  loggedIn?: boolean;
  user: WithAdditionalParams<User>;
  toggleLogin: (open: boolean) => void;
};

const SocialComponent = ({ user, toggleLogin }: Props) => {
  const style = useStyles();
  const [session] = useSession();
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
        </ListItem>
        <ListItem button className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.TWITTER)}>
          <ListItemIcon className={style.icon}>
            <TwitterIcon className={style.twitter} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={typograpyProps} className={style.button}>
            <ShowIf condition={!user.anonymous}>
              <Typography variant="body2">{twitter}</Typography>
            </ShowIf>
          </ListItemText>
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
        </ListItem>
      </List>

      <ShowIf condition={!!session?.user.anonymous}>
        <LoginOverlayComponent toggleLogin={toggleLogin} />
      </ShowIf>

      {selectedSocial && <ConnectComponent social={selectedSocial} user={user} open={connectOpened} handleClose={handleCloseConnect} />}
    </div>
  );
};

export default SocialComponent;
