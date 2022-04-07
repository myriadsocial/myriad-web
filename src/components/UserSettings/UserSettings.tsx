import {DuplicateIcon} from '@heroicons/react/outline';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {IconButton, SvgIcon, Typography} from '@material-ui/core';

import {useStyles} from './UserSettings.styles';

type UserSettingsProps = {
  publicKey: string;
  onPublicKeyCopied: () => void;
};

export const UserSettings: React.FC<UserSettingsProps> = props => {
  const {publicKey, onPublicKeyCopied} = props;

  const styles = useStyles();

  return (
    <div className={styles.box}>
      <div className={styles.root}>
        <Typography variant="h5" gutterBottom className={styles.title}>
          Public Key
        </Typography>

        <div className={styles.account}>
          <Typography variant="body1">{publicKey}</Typography>
          <CopyToClipboard text={publicKey} onCopy={onPublicKeyCopied}>
            <IconButton aria-label="copy-public-key" style={{padding: 0}}>
              <SvgIcon component={DuplicateIcon} color="primary" />
            </IconButton>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};
