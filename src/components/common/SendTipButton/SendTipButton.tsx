import {CurrencyDollarIcon} from '@heroicons/react/outline';

import React from 'react';

import {Button, CircularProgress, IconButton, SvgIcon} from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';

import useTipping from '../Tipping/use-tipping.hook';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import * as WalletAPI from 'src/lib/api/wallet';

type SendTipButtonProps = {
  reference: Post | Comment | User;
  referenceType: ReferenceType;
};

export const SendTipButton: React.FC<SendTipButtonProps> = props => {
  const {reference, referenceType} = props;

  const tipping = useTipping();

  const handleSendTip = async () => {
    let receiver: User | People | null = null;

    // if tipping to User
    if ('username' in reference) {
      receiver = reference;
    }

    // if tipping to Comment
    if ('section' in reference) {
      receiver = reference.user;
    }

    // if tipping to Post
    if ('platform' in reference) {
      // if imported
      if (reference.people) {
        const {walletAddress} = await WalletAPI.getWalletAddress(reference.id);

        receiver = {...reference.people, walletAddress};
      } else {
        receiver = reference.user;
      }
    }

    if (!receiver) return;

    tipping.send({
      receiver,
      reference,
      referenceType,
    });
  };

  return (
    <>
      <Hidden smDown>
        <Button
          disabled={!tipping.enabled}
          onClick={handleSendTip}
          variant="outlined"
          color="secondary"
          size="small">
          {tipping.enabled ? 'Send tip' : <CircularProgress size={14} color="primary" />}
        </Button>
      </Hidden>
      <Hidden smUp>
        <IconButton disabled={!tipping.enabled} onClick={handleSendTip} color="primary">
          <SvgIcon color="inherit" component={CurrencyDollarIcon} viewBox="0 0 24 24" />
        </IconButton>
      </Hidden>
    </>
  );
};
