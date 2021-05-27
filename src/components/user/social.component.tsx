import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { User } from 'next-auth';

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
import { useUserHook } from './use-user.hook';
import { useUser } from './user.context';

import { WithAdditionalParams } from 'next-auth/_utils';
import ConfirmDialog from 'src/components/common/confirm-dialog.component';
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

  const [, setCookie] = useCookies(['social']);
  const { state: userState } = useUser();
  const { getUserDetail, disconnectSocial } = useUserHook(user);

  const [connectOpened, openConnect] = useState(false);
  const [confirmationOpen, setOpenConfirmation] = React.useState(false);
  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum | null>(null);
  const [connected, setConnected] = useState<Record<SocialsEnum, boolean>>({
    [SocialsEnum.TWITTER]: false,
    [SocialsEnum.FACEBOOK]: false,
    [SocialsEnum.REDDIT]: false
  });
  const [twitter, setTwitter] = useState<string>('Link To Twitter');
  const [facebook, setFacebook] = useState<string>('Link To Facebook');
  const [reddit, setReddit] = useState<string>('Link To Reddit');
  const isAnonymous = user.anonymous as boolean;

  useEffect(() => {
    if (userState.user && userState.user.userCredentials.length > 0) {
      const twitterCredential = userState.user.userCredentials.find(item => item.people.platform === SocialsEnum.TWITTER);
      const facebookCredential = userState.user.userCredentials.find(item => item.people.platform === SocialsEnum.FACEBOOK);
      const redditCredential = userState.user.userCredentials.find(item => item.people.platform === SocialsEnum.REDDIT);

      if (twitterCredential) {
        setTwitter(twitterCredential.people.username);
        setConnected({
          ...connected,
          [SocialsEnum.TWITTER]: true
        });
      } else {
        setTwitter('Link To Twitter');
        setConnected({
          ...connected,
          [SocialsEnum.TWITTER]: false
        });
      }

      if (facebookCredential) {
        setFacebook(facebookCredential.people.username);
        setConnected({
          ...connected,
          [SocialsEnum.FACEBOOK]: true
        });
      } else {
        setTwitter('Link To Facebook');
        setConnected({
          ...connected,
          [SocialsEnum.FACEBOOK]: false
        });
      }

      if (redditCredential) {
        setReddit(redditCredential.people.username);
        setConnected({
          ...connected,
          [SocialsEnum.REDDIT]: true
        });
      } else {
        setTwitter('Link To Twitter');
        setConnected({
          ...connected,
          [SocialsEnum.REDDIT]: false
        });
      }
    } else {
      setConnected({
        [SocialsEnum.TWITTER]: false,
        [SocialsEnum.FACEBOOK]: false,
        [SocialsEnum.REDDIT]: false
      });

      setTwitter('Link To Twitter');
      setFacebook('Link To Facebook');
      setReddit('Link To Reddit');
    }
  }, [userState.user]);

  const handleOpenConnect = (social: SocialsEnum) => {
    if (connected[social]) {
      setSelectedSocial(social);
      setOpenConfirmation(true);
    } else {
      setSelectedSocial(social);
      openConnect(true);
    }
  };

  const removeSocialAccount = () => {
    if (selectedSocial) {
      disconnectSocial(selectedSocial);
    }

    setOpenConfirmation(false);
  };

  const handleCloseConnect = () => {
    setCookie(`connecting_${selectedSocial}`, {
      link: true
    });

    getUserDetail();

    openConnect(false);
  };

  const handleToggle = (value: SocialsEnum) => () => {
    onChange(value, !settings[value]);
  };

  return (
    <div className={style.root} id="linked-social">
      <List component="nav">
        <ListItem button disabled className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.FACEBOOK)}>
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
        <ListItem button className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.TWITTER)}>
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
        <ListItem button className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.REDDIT)}>
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

      <ConfirmDialog
        open={confirmationOpen}
        handleClose={() => setOpenConfirmation(false)}
        handleSubmit={removeSocialAccount}
        title="Unlink social account"
        description="Are you sure to remove this account from myriad network?"
      />
    </div>
  );
};

export default SocialComponent;
