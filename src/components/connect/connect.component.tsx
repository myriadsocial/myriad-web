import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {FacebookShareButton, RedditShareButton, TwitterShareButton} from 'react-share';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

import {useStyles} from './conntect.style';

import {isValid} from 'date-fns';
import DialogTitle from 'src/components/common/DialogTitle.component';
import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces';

export type ConnectComponentRefProps = {
  openConnectForm: (social: SocialsEnum) => void;
  closeConnectForm: () => void;
};

type ConnectComponentProps = {
  loading: boolean;
  publicKey: string;
  verify: (social: SocialsEnum, socialName: string) => void;
};

const prefix: Record<SocialsEnum, string> = {
  [SocialsEnum.TWITTER]: 'https://twitter.com/',
  [SocialsEnum.FACEBOOK]: 'https://www.facebook.com/',
  [SocialsEnum.REDDIT]: 'https://www.reddit.com/user/',
  [SocialsEnum.TELEGRAM]: 'https://t.me/',
};

export const ConnectComponent = forwardRef(
  (
    {loading, publicKey, verify}: ConnectComponentProps,
    ref: React.Ref<ConnectComponentRefProps>,
  ) => {
    const styles = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [social, setSocial] = useState<SocialsEnum | null>(null);
    const [socialName, setSocialName] = useState('');
    const [shared, setShared] = useState(false);
    const [termApproved, setTermApproved] = useState(false);
    const [validUrl, setUrlValid] = useState(false);

    const message = `I'm part of the Myriad ${publicKey}`;
    const APP_URL = 'https://app.myriad.systems';

    useImperativeHandle(
      ref,
      () => ({
        openConnectForm(social: SocialsEnum) {
          setSocial(social);
          setOpen(true);
          setShared(false);
          setSocialName('');
        },
        closeConnectForm() {
          close();
        },
      }),
      [social],
    );

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

    const onSharedAttempt = () => {
      setShared(true);
    };

    const handleShared = () => {
      if (social && socialName) {
        let username = socialName;

        if (social === SocialsEnum.FACEBOOK) {
          username = `${prefix.facebook}/${socialName}`;
        }

        verify(social, username);
      }
    };

    const close = () => {
      setOpen(false);
      setShared(false);
      setTermApproved(false);
      setUrlValid(false);
      setSocialName('');
    };

    if (!social) return null;

    return (
      <div>
        <Dialog
          open={open}
          maxWidth="md"
          onClose={close}
          aria-labelledby="link-social-accounts-window">
          <DialogTitle onClose={close} id="link-account">
            Social Media Link
          </DialogTitle>
          <DialogContent className={styles.root}>
            <List component="div" aria-label="connect social steps">
              <ListItem>
                <ListItemIcon style={{alignSelf: 'flex-start'}}>
                  <Avatar className={styles.icon}>1.</Avatar>
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Typography variant="caption">
                    Copy and post the following to your {social} timeline
                  </Typography>
                  <TextField
                    disabled
                    margin="dense"
                    className={styles.message}
                    multiline
                    color="primary"
                    variant="outlined"
                    rows={6}
                    fullWidth={true}
                    value={message}
                    InputProps={{
                      notched: true,
                    }}
                  />
                </ListItemText>
              </ListItem>

              <ListItem>
                <ListItemIcon style={{alignSelf: 'flex-start'}}>
                  <Avatar className={styles.icon}>2.</Avatar>
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Typography variant="caption">
                    Alternatively, you can click the Share button below and just click the Post
                    button in the pop-up!
                  </Typography>
                  <div className={styles.linkAction}>
                    <ShowIf condition={social === SocialsEnum.FACEBOOK}>
                      <FacebookShareButton
                        url={APP_URL}
                        quote={message}
                        beforeOnClick={onSharedAttempt}>
                        <Button
                          component="div"
                          variant="outlined"
                          size="large"
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
                        beforeOnClick={onSharedAttempt}>
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
                        beforeOnClick={onSharedAttempt}>
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

                    <FormControlLabel
                      className={styles.term}
                      control={
                        <Checkbox
                          checked={termApproved}
                          onChange={() => setTermApproved(!termApproved)}
                          name="term"
                        />
                      }
                      label="Please Check this box if you agree with our Privacy and Policy"
                    />
                  </div>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon style={{alignSelf: 'flex-start'}}>
                  <Avatar className={styles.icon}>3.</Avatar>
                </ListItemIcon>
                <ListItemText disableTypography>
                  {social === SocialsEnum.FACEBOOK ? (
                    <Typography variant="caption">
                      Copy and paste the URL of the post (make sure it&apos;s public!) here:
                    </Typography>
                  ) : (
                    <Typography variant="caption">Tell us your {social} username here:</Typography>
                  )}

                  <TextField
                    className={styles.account}
                    hiddenLabel
                    value={socialName}
                    onChange={handleSocialNameChange}
                    onPaste={handleSocialNamePasted}
                    color="primary"
                    margin="dense"
                    error={!isValid}
                    required
                    fullWidth
                    name="username"
                    type="text"
                    id="username"
                    InputProps={{
                      disableUnderline: true,
                      color: 'primary',
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          disableTypography
                          style={{color: theme.palette.primary.dark}}>
                          {prefix[social]}
                        </InputAdornment>
                      ),
                    }}
                  />
                </ListItemText>
              </ListItem>
            </List>

            {loading && <CircularProgress size={40} className={styles.buttonProgress} />}
          </DialogContent>
          <DialogActions className={styles.done}>
            <Button
              onClick={handleShared}
              disabled={!shared || !termApproved || !validUrl || loading}
              size="large"
              variant="contained"
              color="primary">
              Verify My {social} Account
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  },
);

ConnectComponent.displayName = 'ConnectComponent';
