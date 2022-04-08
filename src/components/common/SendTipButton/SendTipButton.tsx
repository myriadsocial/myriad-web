import {CurrencyDollarIcon} from '@heroicons/react/outline';

import React from 'react';

import {Button, CircularProgress, IconButton, SvgIcon} from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';

import useConfirm from '../Confirm/use-confirm.hook';
import useTipping from '../Tipping/use-tipping.hook';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {WalletReferenceType} from 'src/interfaces/wallet';
import * as PostAPI from 'src/lib/api/post';

type SendTipButtonProps = {
  reference: Post | Comment | User;
  referenceType: ReferenceType;
};

export const SendTipButton: React.FC<SendTipButtonProps> = props => {
  const {reference, referenceType} = props;

  const tipping = useTipping();
  const confirm = useConfirm();

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
        try {
          const {referenceId, referenceType} = await PostAPI.getWalletAddress(reference.id);

          if (referenceType === WalletReferenceType.WALLET_ADDRESS) {
            receiver = {...reference.people, walletAddress: referenceId};
          }
        } catch {
          confirm({
            title: 'Send tip on imported post is unavailable',
            description:
              'Currently, send tip on imported post in under repair. Please try again later',
            icon: 'warning',
            confirmationText: 'close',
          });
        }
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
      <Hidden xsDown>
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
