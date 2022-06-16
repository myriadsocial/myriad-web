import React, {useState, useEffect} from 'react';
import {FacebookShareButton, RedditShareButton, TwitterShareButton} from 'react-share';

import getConfig from 'next/config';
import Link from 'next/link';

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
  InputAdornment,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import {socials} from '../atoms/Icons';
import {Modal, ModalProps} from '../atoms/Modal';
import ShowIf from '../common/show-if.component';
import {useStyles} from './AddSocialMedia.styles';

import {SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';

type AddSocialMediaProps = Pick<ModalProps, 'onClose' | 'open'> & {
  social: SocialsEnum;
  address?: string;
  verifying?: boolean;
  verify: (social: SocialsEnum, profileUrl: string, callback?: () => void) => void;
  onBlockchain?: boolean;
  onDrawer?: boolean;
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
  const {
    social,
    address,
    open,
    verifying = false,
    onClose,
    verify,
    onBlockchain = true,
    onDrawer = false,
  } = props;

  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [profileUrl, setProfileUrl] = useState('');
  const [shared, setShared] = useState(false);
  const [termApproved, setTermApproved] = useState(false);

  const {publicRuntimeConfig} = getConfig();

  const APP_URL = publicRuntimeConfig.appAuthURL ?? '';
  const message = i18n.t('SocialMedia.Modal.Msg', {
    address,
    url: publicRuntimeConfig.myriadWebsiteURL,
  });

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
    if (onBlockchain) {
      verify(social, profileUrl, handleClose);
    } else {
      verify(social, profileUrl);

      if (onDrawer) clear();
      else handleClose();
    }
  };

  const handleClose = () => {
    clear();
    onClose();
  };

  return (
    <Modal
      fullScreen={isMobile}
      title={i18n.t('SocialMedia.Modal.Title')}
      subtitle={isMobile && 'Connect your Twitter account'}
      onClose={handleClose}
      open={open}
      className={styles.root}>
      {isMobile ? (
        <div className={styles.wrapperTitle}>
          <Typography component="div" variant="h3">
            Add Twitter account
          </Typography>
        </div>
      ) : (
        <div className={styles.title}>
          <Typography component="div" variant="body1">
            {i18n.t('SocialMedia.Modal.Header', {platform: capitalize(social)})}
          </Typography>
        </div>
      )}
      <div className={styles.steps}>
        <List dense={true}>
          <ListItem>
            <ListItemText disableTypography>
              <Typography component="h1" variant="body1" gutterBottom className={styles.caption}>
                <b>{i18n.t('SocialMedia.Modal.Step_1')}</b>{' '}
                {i18n.t('SocialMedia.Modal.Text_1', {platform: capitalize(social)})}
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
                <b>{i18n.t('SocialMedia.Modal.Step_2')}</b>{' '}
                {social == SocialsEnum.REDDIT
                  ? i18n.t('SocialMedia.Modal.Text_2.Reddit')
                  : i18n.t('SocialMedia.Modal.Text_2.Other')}
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
                      startIcon={socials[SocialsEnum.FACEBOOK]}
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
                      startIcon={socials[SocialsEnum.TWITTER]}
                      className={styles.twitter}>
                      {i18n.t('SocialMedia.Modal.Btn_Twitter')}
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
                      startIcon={socials[SocialsEnum.REDDIT]}
                      className={styles.reddit}>
                      {i18n.t('SocialMedia.Modal.Btn_Reddit')}
                    </Button>
                  </RedditShareButton>
                </ShowIf>
              </div>
            </ListItemText>
          </ListItem>

          <ListItem>
            <ListItemText disableTypography>
              <Typography component="h1" variant="body1" gutterBottom>
                <b>{i18n.t('SocialMedia.Modal.Step_3')}</b>{' '}
                {i18n.t('SocialMedia.Modal.Text_3', {platform: capitalize(social)})}
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
        <div className={styles.wrapperTermCondition}>
          <ListItem>
            <ListItemText disableTypography>
              <FormControlLabel
                onChange={() => setTermApproved(!termApproved)}
                control={<Checkbox name="term" color="primary" className={styles.icon} />}
                label={
                  <Typography>
                    {i18n.t('SocialMedia.Modal.Aggre_1')}{' '}
                    <Link href="/term-of-use" passHref>
                      <span className={styles.term}>{i18n.t('SocialMedia.Modal.Aggre_2')}</span>
                    </Link>
                  </Typography>
                }
              />
            </ListItemText>
          </ListItem>
        </div>
        <Button
          onClick={handleShared}
          disabled={!shared || !termApproved || profileUrl.length === 0}
          fullWidth
          variant="contained"
          color="primary">
          {i18n.t('SocialMedia.Modal.OK', {platform: capitalize(social)})}
        </Button>
      </div>

      <ShowIf condition={!onBlockchain && verifying}>
        <CircularProgress size={40} className={styles.loading} />
      </ShowIf>

      <ShowIf condition={onBlockchain}>
        <Backdrop className={styles.backdrop} open={verifying}>
          <CircularProgress color="primary" />
        </Backdrop>
      </ShowIf>
    </Modal>
  );
};
