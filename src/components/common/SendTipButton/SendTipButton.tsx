import {CurrencyDollarIcon} from '@heroicons/react/outline';

import React from 'react';

import {
  Button,
  CircularProgress,
  SvgIcon,
  ButtonProps,
  CircularProgressProps,
} from '@material-ui/core';

import useConfirm from '../Confirm/use-confirm.hook';
import useTipping from '../Tipping/use-tipping.hook';
import ShowIf from '../show-if.component';
import {useStyles} from './SendTipButton.style';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';
import * as CommentAPI from 'src/lib/api/comment';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';

type SendTipButtonProps = ButtonProps & {
  label?: string;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  showIcon?: boolean;
  mobile?: boolean;
};

interface UserWithWalletDetail extends User {
  walletDetail?: WalletDetail;
}

interface PeopleWithWalletDetail extends People {
  walletDetail?: WalletDetail;
}

export const SendTipButton: React.FC<SendTipButtonProps> = props => {
  const {
    label = 'Send tip',
    reference,
    referenceType,
    showIcon = false,
    mobile = false,
    variant,
    ...restProps
  } = props;

  const styles = useStyles({mobile, color: props.color});
  const tipping = useTipping();
  const confirm = useConfirm();

  const icon = <SvgIcon color="inherit" component={CurrencyDollarIcon} viewBox="0 0 24 24" />;

  const handleSendTip = async () => {
    try {
      let receiver: UserWithWalletDetail | PeopleWithWalletDetail | null = null;

      // if tipping to User
      if ('username' in reference) {
        const walletDetail = await UserAPI.getWalletAddress(reference.id);

        receiver = {...reference, walletDetail};
      }

      // if tipping to Comment
      if ('section' in reference) {
        const walletDetail = await CommentAPI.getWalletAddress(reference.id);

        receiver = {...reference.user, walletDetail};
      }

      // if tipping to Post
      if ('platform' in reference) {
        const walletDetail = await PostAPI.getWalletAddress(reference.id);

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
      <Button
        classes={{root: styles.button}}
        onClick={handleSendTip}
        startIcon={showIcon ? icon : null}
        variant={mobile ? 'text' : variant}
        {...restProps}>
        {label}
        <ShowIf condition={!tipping.enabled && !mobile}>
          <CircularProgress size={14} color={props.color as CircularProgressProps['color']} />
        </ShowIf>
      </Button>
    </>
  );
};
