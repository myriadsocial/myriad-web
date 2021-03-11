import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import RedditIcon from '@material-ui/icons/Reddit';
import ConnectComponent from '../connect/connect.component';
import { SocialsEnum } from '../../interfaces';
import LoginOverlayComponent from '../login/overlay.component';
import ShowIf from '../common/show-if.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: 'transparent',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
      position: 'relative'
    },
    button: {
      height: 24,
      // background: '#A942E9',
      lineHeight: 10,
      textAlign: 'center',
      border: 1,
      // borderColor: '#A942E9',
      borderRadius: 8
    },
    gutters: {
      border: `1px solid`,
      borderColor: '#A942E9',
      borderRadius: 8,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: theme.spacing(1)
      // paddingLeft: 0,
      // paddingTop: theme.spacing(0.5),
      // paddingBottom: theme.spacing(0.5)
    },
    icon: {
      minWidth: 40
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
    },
    login: {
      position: 'absolute',
      top: 0,
      left: 0
    }
  })
);

const typograpyProps = { style: { fontSize: 10, padding: '5px 0', fontWeight: 500 } };

type Props = {
  loggedIn?: boolean;
  toggleLogin: (open) => void;
};

const SocialComponent = ({ loggedIn = true, toggleLogin }: Props) => {
  const classes = useStyles();

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
    <div className={classes.root}>
      <List component="nav">
        <ListItem button className={classes.gutters} onClick={() => handleOpenConnect(SocialsEnum.FACEBOOK)}>
          <ListItemIcon className={classes.icon}>
            <FacebookIcon className={classes.facebook} />
          </ListItemIcon>
          <ShowIf condition={true}>
            <ListItemText primaryTypographyProps={typograpyProps} className={classes.button} primary="Link To Facebook" />
          </ShowIf>
        </ListItem>
        <ListItem button className={classes.gutters} onClick={() => handleOpenConnect(SocialsEnum.TWITTER)}>
          <ListItemIcon className={classes.icon}>
            <TwitterIcon className={classes.twitter} />
          </ListItemIcon>
          <ShowIf condition={true}>
            <ListItemText primaryTypographyProps={typograpyProps} className={classes.button} primary="Link To Twitter" />
          </ShowIf>
        </ListItem>
        <ListItem button className={classes.gutters} onClick={() => handleOpenConnect(SocialsEnum.REDDIT)}>
          <ListItemIcon className={classes.icon}>
            <RedditIcon className={classes.reddit} />
          </ListItemIcon>
          <ShowIf condition={true}>
            <ListItemText primaryTypographyProps={typograpyProps} className={classes.button} primary="Link to Reddit" />
          </ShowIf>
        </ListItem>
      </List>

      <ShowIf condition={!loggedIn}>
        <LoginOverlayComponent toggleLogin={toggleLogin} />
      </ShowIf>

      <ConnectComponent social={selectedSocial} open={connectOpened} handleClose={handleCloseConnect} />
    </div>
  );
};

export default SocialComponent;
