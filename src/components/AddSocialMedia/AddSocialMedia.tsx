import React, {useState, useEffect} from 'react';
import {FacebookShareButton, RedditShareButton, TwitterShareButton} from 'react-share';

import getConfig from 'next/config';

import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  capitalize,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core';

import FacebookIcon from '../../images/socials/facebook.svg';
import RedditIcon from '../../images/socials/reddit.svg';
import TwitterIcon from '../../images/socials/twitter.svg';
import {SocialsEnum} from '../../interfaces/social';
import {Modal, ModalProps} from '../atoms/Modal';
import ShowIf from '../common/show-if.component';
import {useStyles} from './AddSocialMedia.styles';

type AddSocialMediaProps = Pick<ModalProps, 'onClose' | 'open'> & {
  social: SocialsEnum;
  publicKey: string;
  verifying?: boolean;
  verify: (social: SocialsEnum, profileUrl: string) => void;
};

const prefix: Record<SocialsEnum, string> = {
  [SocialsEnum.TWITTER]: 'https://twitter.com/',
  [SocialsEnum.FACEBOOK]: 'https://www.facebook.com/',
  [SocialsEnum.REDDIT]: 'https://www.reddit.com/user/',
  [SocialsEnum.TELEGRAM]: '',
  [SocialsEnum.FOURCHAN]: '',
  [SocialsEnum.INSTAGRAM]: '',
  [SocialsEnum.VK]: '',
  [SocialsEnum.WECHAT]: '',
  [SocialsEnum.WEIBO]: '',
};

export const AddSocialMedia: React.FC<AddSocialMediaProps> = props => {
  const {social, publicKey, open, verifying = false, onClose, verify} = props;

  const styles = useStyles();

  const [profileUrl, setProfileUrl] = useState('');
  const [shared, setShared] = useState(false);
  const [termApproved, setTermApproved] = useState(false);

  const {publicRuntimeConfig} = getConfig();

  const APP_URL = publicRuntimeConfig.nextAuthURL ?? '';
  const message = `I'm part of the @myriad_social ${publicKey}\n\nhttps://www.myriad.social`;

  useEffect(() => {
    return clear();
  }, []);

  const onSharedAttempt = () => {
    setShared(true);
  };

  const clear = () => {
    setShared(false);
    setTermApproved(false);
    setProfileUrl('');
  };

  const handleSocialNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setProfileUrl(text.replace(/\/$/, '').replace(prefix[social], ''));
  };

  const handleSocialNamePasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');

    setProfileUrl(text.replace(/\/$/, '').replace(prefix[social], ''));
  };

  const handleShared = () => {
    verify(social, profileUrl);

    handleClose();
  };

  const handleClose = () => {
    clear();
    onClose();
  };

  return (
    <Modal title="Add social media" onClose={handleClose} open={open} className={styles.root}>
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

              <TextField
                id="social-profile-url"
                name={`${capitalize(social)} Account URL`}
                type="text"
                placeholder={`laraschoffield`}
                onChange={handleSocialNameChange}
                onPaste={handleSocialNamePasted}
                value={profileUrl}
                InputProps={{
                  disableUnderline: true,
                  color: 'primary',
                  startAdornment: (
                    <InputAdornment position="start" disableTypography>
                      {prefix[social]}
                    </InputAdornment>
                  ),
                }}
              />
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
                    className={styles.fullWidth}>
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
                    className={styles.fullWidth}>
                    <Button
                      component="div"
                      variant="outlined"
                      color="secondary"
                      fullWidth
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
                    className={styles.fullWidth}>
                    <Button
                      component="div"
                      variant="outlined"
                      color="secondary"
                      fullWidth
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
                onChange={() => setTermApproved(!termApproved)}
                control={<Checkbox name="term" color="primary" className={styles.icon} />}
                label={
                  <Typography>
                    I agree to the Myriad{' '}
                    <a href="/term-of-use" className={styles.term}>
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
        disabled={!shared || !termApproved || profileUrl.length === 0}
        fullWidth
        variant="contained"
        color="primary">
        Verify My {capitalize(social)} Account
      </Button>

      <ShowIf condition={verifying}>
        <CircularProgress size={40} className={styles.loading} />
      </ShowIf>
    </Modal>
  );
};
