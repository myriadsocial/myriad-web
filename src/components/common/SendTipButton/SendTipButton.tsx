import {CurrencyDollarIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {
  Button,
  CircularProgress,
  SvgIcon,
  ButtonProps,
  CircularProgressProps,
  Typography,
} from '@material-ui/core';

import useConfirm from '../Confirm/use-confirm.hook';
import useTipping from '../Tipping/use-tipping.hook';
import ShowIf from '../show-if.component';
import {useStyles} from './SendTipButton.style';

import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User, Wallet} from 'src/interfaces/user';
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

  const [promptFailedTip, setPromptFailedTip] = useState(false);

  const icon = <SvgIcon color="inherit" component={CurrencyDollarIcon} viewBox="0 0 24 24" />;

  const handleSendTip = async () => {
    let receiver: UserWithWalletDetail | PeopleWithWalletDetail | null = null;
    let walletReceiver: Wallet[] = [];
    try {
      // if tipping to User
      if ('username' in reference) {
        receiver = reference;
        walletReceiver = reference.wallets;
        const walletDetail = await UserAPI.getWalletAddress(reference.id);

        receiver = {...reference, walletDetail};
      }

      // if tipping to Comment
      if ('section' in reference) {
        receiver = reference.user;
        const walletDetail = await CommentAPI.getWalletAddress(reference.id);

        receiver = {...reference.user, walletDetail};
      }

      // if tipping to Post
      if ('platform' in reference) {
        receiver = reference.people ?? reference.user;
        walletReceiver = reference?.user?.wallets;
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
    } catch (error) {
      if (
        walletReceiver.length > 0 &&
        walletReceiver.filter(wallet => wallet.type === tipping.currentWallet).length === 0
      ) {
        setPromptFailedTip(true);
      } else {
        confirm({
          title: 'Wallet account not found',
          description: 'This post wallet address is unavailable',
          icon: 'warning',
          confirmationText: 'close',
          hideCancel: true,
        });
      }
    }
  };

  return (
    <>
      <Button
        disabled={!tipping.enabled}
        classes={{root: styles.button}}
        onClick={handleSendTip}
        startIcon={showIcon ? icon : null}
        variant={mobile ? 'text' : variant}
        {...restProps}>
        {label}
        <ShowIf condition={!tipping.enabled && !mobile}>
          <div className={styles.loading}>
            <CircularProgress size={14} color={props.color as CircularProgressProps['color']} />
          </div>
        </ShowIf>
      </Button>

      <PromptComponent
        icon="danger"
        open={promptFailedTip}
        onCancel={() => setPromptFailedTip(false)}
        title="Send tip couldn't be processed"
        subtitle={
          <Typography component="div">
            {`This user is unable to receive tips because their ${tipping.currentWallet?.toUpperCase()} \n wallet is not connected yet. Try using another network`}
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setPromptFailedTip(false);
            }}>
            OK
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
