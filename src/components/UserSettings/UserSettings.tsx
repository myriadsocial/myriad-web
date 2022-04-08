import {DuplicateIcon} from '@heroicons/react/outline';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
  TextField,
  Typography,
} from '@material-ui/core';

import {WalletOption} from '../Manage/use-wallet-list.hook';
import ShowIf from '../common/show-if.component';
import {useStyles} from './UserSettings.styles';

type UserSettingsProps = {
  wallets: WalletOption[];
  onPublicKeyCopied: () => void;
};

export const UserSettings: React.FC<UserSettingsProps> = props => {
  const {wallets, onPublicKeyCopied} = props;

  const styles = useStyles();

  return (
    <div className={styles.box}>
      <div className={styles.root}>
        <div className={styles.account}>
          {wallets.map(option => (
            <ListItem alignItems={option.isConnect ? 'flex-start' : 'center'} key={option.id}>
              <ListItemAvatar>{option.icons}</ListItemAvatar>
              <ListItemText>
                <Typography variant="h5" component="span" color="textPrimary">
                  {option.title}
                </Typography>
                <ShowIf condition={option.isConnect}>
                  <TextField
                    id="copy-wallet-address"
                    value={option.walletId}
                    variant="outlined"
                    disabled
                    fullWidth
                    margin="none"
                    className={styles.input}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CopyToClipboard text={option.walletId} onCopy={onPublicKeyCopied}>
                            <IconButton aria-label="copy-post-link" style={{padding: 0}}>
                              <SvgIcon component={DuplicateIcon} color="primary" />
                            </IconButton>
                          </CopyToClipboard>
                        </InputAdornment>
                      ),
                    }}
                  />
                </ShowIf>
              </ListItemText>
            </ListItem>
          ))}
        </div>
      </div>
    </div>
  );
};
