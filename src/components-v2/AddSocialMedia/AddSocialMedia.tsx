import React, {useState} from 'react';
import {FacebookShareButton, RedditShareButton, TwitterShareButton} from 'react-share';

import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  OutlinedInput,
  FormControl,
  InputLabel,
  capitalize,
} from '@material-ui/core';

import ShowIf from '../../components/common/show-if.component';
import FacebookIcon from '../../images/socials/facebook.svg';
import RedditIcon from '../../images/socials/reddit.svg';
import TwitterIcon from '../../images/socials/twitter.svg';
import {SocialsEnum} from '../../interfaces/social';
import {Modal, ModalProps} from '../atoms/Modal';
import {useStyles} from './AddSocialMedia.styles';

type AddSocialMediaProps = ModalProps & {
  social: SocialsEnum;
  publicKey: string;
  verify: (social: SocialsEnum, username: string) => void;
};

const prefix: Record<SocialsEnum, string> = {
  [SocialsEnum.TWITTER]: 'https://twitter.com/',
  [SocialsEnum.FACEBOOK]: 'https://www.facebook.com/',
  [SocialsEnum.REDDIT]: 'https://www.reddit.com/user/',
  [SocialsEnum.INSTAGRAM]: '',
  [SocialsEnum.FOURCHAN]: '',
  [SocialsEnum.VK]: '',
  [SocialsEnum.WECHAT]: '',
  [SocialsEnum.WEIBO]: '',
  [SocialsEnum.TELEGRAM]: '',
};

export const AddSocialMedia: React.FC<AddSocialMediaProps> = props => {
  const {social, publicKey, open, onClose, verify} = props;

  const styles = useStyles();

  const [socialName, setSocialName] = useState('');
  const [shared, setShared] = useState(false);
  const [termApproved, setTermApproved] = useState(false);
  const [validUrl, setUrlValid] = useState(false);

  const APP_URL = 'https://app.myriad.systems';
  const message = `I'm part of the Myriad ${publicKey}`;

  const onSharedAttempt = () => {
    setShared(true);
  };

  const clear = () => {
    setShared(false);
    setTermApproved(false);
    setUrlValid(false);
    setSocialName('');
  };

  const handleSocialNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    if (social === SocialsEnum.FACEBOOK) {
      setSocialName(text);
    } else {
      const name = text.substring(text.lastIndexOf('/') + 1);
      setSocialName(name);
    }

    setUrlValid(text.trim().length > 0);
  };

  const handleSocialNamePasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');

    if (social === SocialsEnum.FACEBOOK) {
      const name = text.replace(prefix.facebook, '');

      setSocialName(name);
      setUrlValid(name.trim().length > 0);
    } else {
      const name = text.substring(text.lastIndexOf('/') + 1);

      setSocialName(name);
      setUrlValid(name.trim().length > 0);
    }
  };

  const handleShared = () => {
    if (social && socialName) {
      let username = socialName;

      if (social === SocialsEnum.FACEBOOK) {
        username = `${prefix.facebook}/${socialName}`;
      }

      verify(social, username);

      clear();
      onClose();
    }
  };

  return (
    <Modal title="Add social media" onClose={onClose} open={open} className={styles.root}>
      <div className={styles.title}>
        <Typography component="div" variant="body1">
          Connect your {capitalize(social)} account
        </Typography>
      </div>
      <div className={styles.steps}>
        <List dense={true}>
          <ListItem>
            <ListItemText disableTypography>
              <Typography component="h1" variant="body1" gutterBottom className={styles.caption}>
                <b>Step 1:</b> Fill in your {capitalize(social)} account URL
              </Typography>

              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="experience-name">{capitalize(social)} Account URL</InputLabel>
                <OutlinedInput
                  id="experience-name"
                  placeholder="Ex: twitter.com/laraschoffield"
                  labelWidth={160}
                />
              </FormControl>
            </ListItemText>
          </ListItem>

          <ListItem>
            <ListItemText disableTypography>
              <Typography component="h1" variant="body1" gutterBottom>
                <b>Step 2:</b> Copy Text below and post it on your timeline
              </Typography>

              <TextField
                disabled
                margin="dense"
                multiline
                color="primary"
                variant="outlined"
                rows={3}
                fullWidth={true}
                InputProps={{
                  notched: true,
                }}
                value={message}
                onChange={handleSocialNameChange}
                onPaste={handleSocialNamePasted}
              />

              <div className={styles.post}>
                <ShowIf condition={social === SocialsEnum.FACEBOOK}>
                  <FacebookShareButton
                    url={APP_URL}
                    quote={message}
                    beforeOnClick={onSharedAttempt}
                    className={styles.fullwidth}>
                    <Button
                      component="div"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      startIcon={<FacebookIcon />}
                      className={styles.facebook}>
                      Share
                    </Button>
                  </FacebookShareButton>
                </ShowIf>

                <ShowIf condition={social === SocialsEnum.TWITTER}>
                  <TwitterShareButton
                    url={APP_URL}
                    title={message}
                    beforeOnClick={onSharedAttempt}
                    className={styles.fullwidth}>
                    <Button
                      component="div"
                      variant="outlined"
                      size="large"
                      startIcon={<TwitterIcon />}
                      className={styles.twitter}>
                      Tweet Now
                    </Button>
                  </TwitterShareButton>
                </ShowIf>

                <ShowIf condition={social === SocialsEnum.REDDIT}>
                  <RedditShareButton
                    url={APP_URL}
                    title={message}
                    beforeOnClick={onSharedAttempt}
                    className={styles.fullwidth}>
                    <Button
                      component="div"
                      variant="outlined"
                      size="large"
                      startIcon={<RedditIcon />}
                      className={styles.reddit}>
                      Share
                    </Button>
                  </RedditShareButton>
                </ShowIf>
              </div>
            </ListItemText>
          </ListItem>

          <ListItem>
            <ListItemText disableTypography>
              <Typography component="h1" variant="body1" gutterBottom>
                <b>Step 3:</b> Verify your {capitalize(social)} account, repeat step 2 if it’s not
                verified
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <FormControlLabel
                control={<Checkbox name="term" color="primary" />}
                label={
                  <Typography>
                    I agree to the Myriad{' '}
                    <a href="/" className={styles.term}>
                      Terms of Service
                    </a>
                  </Typography>
                }
              />
            </ListItemText>
          </ListItem>
        </List>
      </div>

      <Button
        onClick={handleShared}
        disabled={!shared || !termApproved || !validUrl}
        fullWidth
        variant="contained"
        color="primary">
        Verify My {capitalize(social)} Account
      </Button>
    </Modal>
  );
};
