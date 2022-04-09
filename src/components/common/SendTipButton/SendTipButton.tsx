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
import {WalletDetail} from 'src/interfaces/wallet';
import * as PostAPI from 'src/lib/api/post';

type SendTipButtonProps = {
  reference: Post | Comment | User;
  referenceType: ReferenceType;
};

interface UserWithWalletDetail extends User {
  walletDetail?: WalletDetail;
}

interface PeopleWithWalletDetail extends People {
  walletDetail?: WalletDetail;
}

export const SendTipButton: React.FC<SendTipButtonProps> = props => {
  const {reference, referenceType} = props;

  const tipping = useTipping();
  const confirm = useConfirm();

  const handleSendTip = async () => {
    try {
      let receiver: UserWithWalletDetail | PeopleWithWalletDetail | null = null;

      const walletDetail = await PostAPI.getWalletAddress(reference.id);

      // if tipping to User
      if ('username' in reference) {
        receiver = {...reference, walletDetail};
      }

      // if tipping to Comment
      if ('section' in reference) {
        receiver = {...reference.user, walletDetail};
      }

      // if tipping to Post
      if ('platform' in reference) {
        if (reference.people) {
          receiver = {...reference.people, walletDetail};
        } else {
          receiver = {...reference.user, walletDetail};
        }
      }

      if (!receiver) throw new Error('Not Found');

      tipping.send({
        receiver,
        reference,
        referenceType,
      });
    } catch {
      confirm({
        title: 'Wallet account not found',
        description: 'This post wallet address is unavailable',
        icon: 'warning',
        confirmationText: 'close',
        hideCancel: true,
      });
    }
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
