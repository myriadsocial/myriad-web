import React from 'react';

import { useSession } from 'next-auth/client';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import { SocialsEnum } from '../../interfaces';
import ShowIf from '../common/show-if.component';
import ConnectComponent from '../connect/connect.component';
import LoginOverlayComponent from '../login/overlay.component';
import { useStyles } from './social.style';

const typograpyProps = { style: { fontSize: 10, padding: '5px 0', fontWeight: 500 } };

type Props = {
  loggedIn?: boolean;
  toggleLogin: (open: boolean) => void;
};

const SocialComponent = ({ toggleLogin }: Props) => {
  const style = useStyles();
  const [session] = useSession();

  const [connectOpened, openConnect] = React.useState(false);
  const [selectedSocial, setSocial] = React.useState(SocialsEnum.FACEBOOK);

  const handleOpenConnect = (social: SocialsEnum) => {
    setSocial(social);
    openConnect(true);
  };

  const handleCloseConnect = () => {
    openConnect(false);
  };

  return (
    <div className={style.root}>
      <List component="nav">
        <ListItem button className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.FACEBOOK)}>
          <ListItemIcon className={style.icon}>
            <FacebookIcon className={style.facebook} />
          </ListItemIcon>
          <ShowIf condition={true}>
            <ListItemText primaryTypographyProps={typograpyProps} className={style.button} primary="Link To Facebook" />
          </ShowIf>
        </ListItem>
        <ListItem button className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.TWITTER)}>
          <ListItemIcon className={style.icon}>
            <TwitterIcon className={style.twitter} />
          </ListItemIcon>
          <ShowIf condition={true}>
            <ListItemText primaryTypographyProps={typograpyProps} className={style.button} primary="Link To Twitter" />
          </ShowIf>
        </ListItem>
        <ListItem button className={style.gutters} onClick={() => handleOpenConnect(SocialsEnum.REDDIT)}>
          <ListItemIcon className={style.icon}>
            <RedditIcon className={style.reddit} />
          </ListItemIcon>
          <ShowIf condition={true}>
            <ListItemText primaryTypographyProps={typograpyProps} className={style.button} primary="Link to Reddit" />
          </ShowIf>
        </ListItem>
      </List>

      <ShowIf condition={!!session?.user.anonymous}>
        <LoginOverlayComponent toggleLogin={toggleLogin} />
      </ShowIf>

      <ConnectComponent social={selectedSocial} open={connectOpened} handleClose={handleCloseConnect} />
    </div>
  );
};

export default SocialComponent;
