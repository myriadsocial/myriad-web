import {DuplicateIcon} from '@heroicons/react/outline';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {TextField, InputAdornment} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './manage.style';

import {NearNetworkIcon24} from 'src/components/atoms/Icons';
import ShowIf from 'src/components/common/show-if.component';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';

export const Manage: React.FC = () => {
  const style = useStyles();
  const {openToasterSnack} = useToasterSnackHook();

  // TODO FIXED LOGIC WHEN WIRING
  const [connect] = React.useState(true);

  const handleLinkCopied = () => {
    openToasterSnack({
      message: 'Link copied!',
      variant: 'success',
    });
  };

  return (
    <>
      <div>
        {/* MAPING ARRAY OF DATA NETWORK */}
        <ListItem alignItems={connect ? 'flex-start' : 'center'}>
          <ListItemAvatar>
            <NearNetworkIcon24 width={'40px'} height={'40px'} />
          </ListItemAvatar>
          <ListItemText>
            <Typography variant="h5" component="span" color="textPrimary">
              NEAR Wallet
            </Typography>
            <ShowIf condition={connect}>
              <TextField
                id="copy-wallet-address"
                value={'aaronting.near'}
                variant="outlined"
                disabled
                fullWidth
                margin="none"
                className={style.input}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard text={'aaronting.near'} onCopy={handleLinkCopied}>
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
          <ShowIf condition={!connect}>
            <div className={style.secondaryAction}>
              <Button variant="outlined" size="small" color="secondary">
                Connect
              </Button>
            </div>
          </ShowIf>
        </ListItem>
      </div>
    </>
  );
};
