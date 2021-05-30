import React, { useCallback, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import { SocialsEnum } from '../../interfaces';
import ShowIf from '../common/show-if.component';
import { useStyles } from './conntect.style';

import DialogTitleCustom from 'src/components/common/DialogTitle.component';
import { useShareSocial } from 'src/hooks/use-share-social';
import { User } from 'src/interfaces/user';

export type Props = {
  open: boolean;
  social: SocialsEnum;
  user: User;
  onClose: () => void;
};

const prefix: Record<SocialsEnum, string> = {
  [SocialsEnum.TWITTER]: 'https://twitter.com/',
  [SocialsEnum.FACEBOOK]: 'https://www.facebook.com/',
  [SocialsEnum.REDDIT]: 'https://www.reddit.com/user/'
};

export default function VerifyComponent({ user, social, open, onClose }: Props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const { shareOnTwitter, shareOnReddit, shareOnFacebook } = useShareSocial(user.id);

  const share = useCallback(
    (username: string) => {
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
    },
    [social]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('target value is: ', e.target.value);
    const text = e.target.value;
    const name = text.substring(text.lastIndexOf('/') + 1);

    setUsername(name);
  };

  const handlePasteValue = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('Text');
    const name = text.substring(text.lastIndexOf('/') + 1);

    setUsername(name);
  };

  const verifyFacebook = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData('Text');
    const name = text.replace(prefix.facebook, '');

    setUsername(name);
  };

  const setShared = () => {
    share(username);
    onClose();
  };

  const helperTextCopyURL = 'Copy and paste the complete url of your account (e.g. https://twitter.com/myAccount)';

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm" disableBackdropClick disableEscapeKeyDown>
        <DialogTitleCustom id="user-title" onClose={onClose}>
          {social !== SocialsEnum.FACEBOOK ? `Fill your username in ${social}` : 'Copy Facebook shared url to verify'}
        </DialogTitleCustom>
        <DialogContent>
          <ShowIf condition={social !== SocialsEnum.FACEBOOK}>
            <TextField
              value={username}
              onChange={handleUsernameChange}
              onPaste={handlePasteValue}
              color="secondary"
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="text"
              id="username"
              InputProps={{
                startAdornment: <InputAdornment position="start">{prefix[social]}</InputAdornment>
              }}
            />
            <FormHelperText>{helperTextCopyURL}</FormHelperText>
          </ShowIf>
          <ShowIf condition={social === SocialsEnum.FACEBOOK}>
            <TextField
              value={username}
              onPaste={verifyFacebook}
              color="secondary"
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="posturl"
              label="Post Url"
              type="text"
              id="posturl"
              InputProps={{
                startAdornment: <InputAdornment position="start">{prefix[social]}</InputAdornment>
              }}
            />
            <FormHelperText>{helperTextCopyURL}</FormHelperText>
          </ShowIf>
        </DialogContent>
        <DialogActions className={classes.done}>
          <Button onClick={setShared} fullWidth={true} size="large" variant="contained" color="secondary">
            {' '}
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
